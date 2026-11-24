const socket = io();

socket.on('connect', function() {
    console.log("Socket.IO connecté :", socket.id);
});

function envoyerMQTT(module, capteur, valeur) {
    console.log(`Commande MQTT : RAM/${module}/CMD/${capteur} = ${valeur}`);

    socket.emit('commandeMQTT', {
        topic: `RAM/${module}/CMD/${capteur}`,
        valeur: valeur
    });
}
function envoyerMQTT_ACK( capteur) {
    console.log(`Commande MQTT : RAM/ALARMES/ACK/${capteur} = 1`);

    socket.emit('commandeMQTT', {
        topic: `RAM/ALARMES/ACK/${capteur}`,
        valeur: 1
    });
}

socket.on("alarme", function(data) {

    const popup = document.getElementById("popup");
    const bandeau = document.getElementById("bandeauAlarme");

    if (!popup || !bandeau) return;

    // Alarme désactivée
    if (!data.active) {
        popup.close();
        bandeau.hidden = true;
        return;
    }

    // Utilisateur sur la page concernée
    if (window.location.pathname === data.page) {
        popup.close();

        bandeau.textContent = data.message;
        bandeau.hidden = false;
    }

    // Utilisateur sur une autre page
    else {
        bandeau.hidden = true;

        afficherPopup(data.titre, data.message, data.page);
    }
});

// Affichage de la pop-up
function afficherPopup(titre, message, page) {

    const popup = document.getElementById("popup");

    document.getElementById("popupTitre").textContent = titre;
    document.getElementById("popupMessage").textContent = message;

    document.getElementById("popupRedirection").onclick = function() {
        window.location.href = page;
    };

    if (!popup.open) {
        popup.showModal();
    }
}

// Fermeture de la pop-up
function fermerPopup() {
    document.getElementById("popup").close();
}