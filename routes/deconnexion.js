/**
 * @file deconnexion.js
 * @brief Termine la session de l'utilisateur et le redirige vers la connexion.
 * @author Anthony
 * @date 2026-11-03
 */
const express = require('express');
const router = express.Router();

function deconnecter(req, res) {
    req.session = null;
    res.redirect('/connexion');
}

router.get('/', deconnecter);
router.post('/', deconnecter);

module.exports = router;