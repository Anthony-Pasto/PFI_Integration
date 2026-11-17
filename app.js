/** @file app.js @author Anthony @brief Squelette Express et EJS */
const express = require('express');
const app = express();
const PORT = 3000;
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);


const index = require('./routes/index');


var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');


client.on('connect', function () {
  console.log("MQTT connecté !");
});
client.subscribe('RAM/#');

client.on('message', function (topic, message) {
  const [element, gestion, lecture, capteur] = topic.toString().split('/');
  const contenu = message.toString().trim();

  const texte = contenu;
  //const commandesMajuscules = ['DELETE', 'NEW', 'MODULE', 'ITEM'];

  const commande = commandesMajuscules.includes(texte.toUpperCase())
    ? texte.toUpperCase()
    : texte;

 if (element === 'RAM' && lecture === 'ETATS') {
        io.emit(gestion, {
            capteur: capteur,
            texte: texte
        });
    }

console.log(element, gestion, lecture, capteur);
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('./routes/ASPIRATEUR'));
app.use(require('./routes/BALANCE'));
app.use(require('./routes/PANNEAU'));
app.use(require('./routes/POWERMETER'));
app.use(require('./routes/MELANGEUR'));
app.use(require('./routes/ALARMES'));
app.use(require('./routes/POWERMETER'));
app.use('/contacts', require('./routes/contacts'));
app.use((req, res) => res.status(404).render('pages/404', { title: 'Page introuvable' }));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});
if (require.main === module) app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
module.exports = { app };
