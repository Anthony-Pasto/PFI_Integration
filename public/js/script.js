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