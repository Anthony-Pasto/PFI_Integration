# PFI - Tableau de contrôle industriel

Application web Node.js permettant de visualiser les états des équipements et d'envoyer des commandes MQTT.

## Technologies

- Node.js
- Express 5
- EJS
- Socket.IO
- MQTT
- MySQL
- cookie-session

## Prérequis

- Node.js installé
- Un courtier MQTT accessible sur `mqtt://127.0.0.1:1883`
- MySQL avec une base de données nommée `PaysG20`

Les paramètres MySQL actuels sont définis dans `app.js` :

- Hôte : `localhost`
- Utilisateur : `root`
- Mot de passe : `root`
- Base de données : `PaysG20`

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

L'application est disponible à l'adresse :

<http://localhost:3000>

## Pages disponibles

- `/` - Tableau de bord
- `/aspirateur` - Aspirateur
- `/balance` - Balance
- `/panneau` - Panneau
- `/powermeter` - Power Meter
- `/melangeur` - Mélangeur
- `/alarmes` - Alarmes
- `/valves` - Valves

## Communication MQTT

Le serveur s'abonne aux sujets commençant par `RAM/#`.

Les sujets des états doivent respecter la structure :

```text
RAM/<module>/ETATS/<capteur>
```

Les commandes envoyées depuis le navigateur sont publiées avec le format :

```text
RAM/<module>/CMD/<capteur>
```

## Structure du projet

```text
app.js              Configuration du serveur Express, Socket.IO, MQTT et MySQL
routes/             Définitions des routes
views/pages/        Pages EJS
views/partials/     En-tête, pied de page et éléments communs
public/css/         Feuilles de style
public/js/          Scripts côté navigateur
public/images/      Images
```



