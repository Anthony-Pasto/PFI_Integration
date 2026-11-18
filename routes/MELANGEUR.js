const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/MELANGEUR', { title: 'MELANGEUR' }));
router.post('/', (req, res) => {
    console.log(req.body);
    res.render('pages/MELANGEUR', { title: 'MELANGEUR' });
});
module.exports = router;
