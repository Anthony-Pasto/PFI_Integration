const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/PANNEAU', { title: 'PANNEAU' }));
router.post('/', (req, res) => {
    console.log(req.body);
    res.render('pages/PANNEAU', { title: 'PANNEAU' });
});
module.exports = router;
