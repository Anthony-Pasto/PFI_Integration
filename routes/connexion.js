/**
 * @file connexion.js
 * @brief Gere l'authentification et restaure la page du compte depuis la session.
 * @author Anthony
 * @date 2026-11-03
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'PaysG20'
});



/** @brief Recharge les donnees du compte connecte apres une navigation ou un rechargement. */
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/acceuil');
    }

    return res.render('pages/connexion', { title: 'Connexion' });
});
/** @brief Verifie les identifiants, enregistre l'utilisateur en session et redirige. */
router.post('/', (req, res) => {
    connection.query('SELECT * FROM acces WHERE login = ? AND password = ?', [req.body.name, req.body.password], (error, results) => {


        if (error) {
            console.error(error);
            return res.status(500).render('pages/connexion', { title: 'Connexion', error: 'Erreur lors de la connexion' });
        } else {
            if (results.length > 0) {
                const utilisateur = results[0];
                req.session.user = {
                    ID: utilisateur.ID,
                    login: utilisateur.login,
                    type: Number(utilisateur.niveau)
                };
                return res.redirect('/acceuil');
            } else {
                return res.status(401).render('pages/connexion', { title: 'Connexion', error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
        }
    });
});
module.exports = router;