/** @file app.js @author Anthony @brief Squelette Express et EJS */
const express = require('express');
const http = require('http');
const app = express();
const PORT = 3000;
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'PaysG20'
});
const session = require('cookie-session');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');
const { spawn } = require('child_process');

app.use(express.urlencoded({ extended: true }));

/** @brief Partage une session signee entre toutes les routes pendant 5 minutes. */
app.use(session({
  name: 'session',
  keys: ['ma-cle-secrete-a-remplacer'],
  maxAge: 500 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}));

const cameraIP = "172.17.15.110";
const cameraUser = "etudiant";
const cameraPassword = "Panneau_RAM";

const cameraURL = `rtsp://${encodeURIComponent(cameraUser)}:${encodeURIComponent(cameraPassword)}@${cameraIP}:554/Streaming/Channels/102`;

app.get('/camera/flux', (req, res) => {

  console.log("Demande de flux vidéo reçue");

  if (!req.session?.user) {
    console.log("Session non autorisée");
    return res.sendStatus(403);
  }

  console.log("Démarrage de FFmpeg");

  const ffmpeg = spawn('ffmpeg', [
    '-hide_banner',
    '-rtsp_transport', 'tcp',
    '-i', cameraURL,
    '-an',
    '-vf', 'fps=15',
    '-c:v', 'mjpeg',
    '-q:v', '5',
    '-f', 'mpjpeg',
    '-boundary_tag', 'ffmpeg',
    'pipe:1'
  ]);

  res.setHeader(
    'Content-Type',
    'multipart/x-mixed-replace; boundary=ffmpeg'
  );

  res.setHeader('Cache-Control', 'no-store');

  ffmpeg.stdout.once('data', () => {
    console.log("Flux vidéo reçu !");
  });

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on('data', (data) => {
    console.log("FFmpeg :", data.toString()
      .split(cameraURL).join('[CAMERA]'));
  });

  ffmpeg.on('error', (err) => {
    console.error("ERREUR :", err.message);

    if (!res.headersSent) {
      res.removeHeader('Content-Type');
      res.sendStatus(500);
    } else {
      res.end();
    }
  });

  ffmpeg.on('close', (code) => {
    console.log("FFmpeg terminé :", code);
    res.end();
  });

  res.on('close', () => {
    ffmpeg.kill();
  });
});



connection.connect(function (err) {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
    return;
  }
  console.log('Vous êtes connecté à votre BDD...');
});



const index = require('./routes/index');





client.on('connect', function () {
  console.log("MQTT connecté !");
});

client.subscribe('RAM/#');
let dernierModePanneau;
const alarmes = {
  ALR_GB_OVF: { etatPi: null, memorisee: false },
  ALR_PB_OVF: { etatPi: null, memorisee: false },
  ALR_GB_NIV_MAX: { etatPi: null, memorisee: false },
  ALR_PB_NIV_MAX: { etatPi: null, memorisee: false },
  ALR_CNX_BAL: { etatPi: null, memorisee: false },
  ALR_CNX_POW: { etatPi: null, memorisee: false }
};

client.on('message', function (topic, message) {
  const [element, gestion, lecture, capteur] = topic.toString().split('/');
  const contenu = message.toString().trim();
  const texte = contenu;


  if (element === 'RAM' && gestion === 'ALARMES' && lecture === 'ETATS' &&
    Object.hasOwn(alarmes, capteur)) {
    if (texte !== 'ON' && texte !== 'OFF') return;

    const alarme = alarmes[capteur];
    alarme.etatPi = texte;

    if (texte === 'ON') alarme.memorisee = true;
    if(texte=== 'OFF')alarme.memorisee = false;

    io.emit('ALARMES', {
      capteur,
      texte: alarme.memorisee ? 'ON' : 'OFF'
    });
    return;
  }



  if (element === 'RAM' && lecture === 'ETATS') {
    if (gestion === 'PANNEAU' && capteur === 'Mode') {
      dernierModePanneau = texte;
    }
    io.emit(gestion, {
      capteur: capteur,
      texte: texte
    });
  }

  console.log(element, gestion, lecture, capteur);
});

io.on('connection', function (socket) {

  console.log('Client Web connecté :', socket.id);
  if (dernierModePanneau !== undefined) {
    socket.emit('PANNEAU', { capteur: 'Mode', texte: dernierModePanneau });
  }
  for (const [capteur, alarme] of Object.entries(alarmes)) {
    socket.emit('ALARMES', {
      capteur,
      texte: alarme.memorisee ? 'ON' : 'OFF'
    });
  }

  socket.on('acquitterAlarme', (capteur) => {
    if (!Object.hasOwn(alarmes, capteur)) return;

    const alarme = alarmes[capteur];
    if (alarme.etatPi !== 'OFF') return;

    alarme.memorisee = false;
    io.emit('ALARMES', { capteur, texte: 'OFF' });
  });

  socket.on('commandeMQTT', function (data) {

    const topic = data?.topic;
    const valeur = String(data?.valeur ?? '').trim();

    // Vérification du topic et de la valeur
   /* if (
      typeof topic !== 'string' ||
      !/^RAM\/[A-Za-z0-9_]+\/CMD\/[A-Za-z0-9_]+$/.test(topic) ||
      valeur === ''
    ) {
      console.log('Commande MQTT invalide');
      return;
    }*/

    if (!client.connected) {
      console.log('MQTT non connecté');
      return;
    }

    client.publish(topic, valeur, function (err) {

      if (err) {
        console.error('Erreur MQTT :', err);
      } else {
        console.log(`MQTT publié : ${topic} = ${valeur}`);
      }

    });

  });

});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/connexion');
  }
  next();
}

app.use('/deconnexion', require('./routes/deconnexion'));
app.use('/connexion', require('./routes/connexion'));

app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/acceuil');
  }
  return res.redirect('/connexion');
});

app.use('/acceuil', requireAuth, require('./routes/index'));
app.use('/aspirateur', requireAuth, require('./routes/ASPIRATEUR'));
app.use('/balance', requireAuth, require('./routes/BALANCE'));
app.use('/panneau', requireAuth, require('./routes/PANNEAU'));
app.use('/powermeter', requireAuth, require('./routes/POWERMETER'));
app.use('/melangeur', requireAuth, require('./routes/MELANGEUR'));
app.use('/alarmes', requireAuth, require('./routes/ALARMES'));
app.use('/valves', requireAuth, require('./routes/VALVES'));
app.use('/cam', requireAuth, require('./routes/CAM'));

app.use((req, res) => res.status(404).render('pages/404', { title: 'Page introuvable' }));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});
if (require.main === module) server.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
module.exports = { app, server, io };
