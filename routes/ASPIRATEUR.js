const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/ASPIRATEUR', { title: 'ASPIRATEUR' }));
router.post('/', (req, res) => {
    console.log(req.body);
    res.render('pages/ASPIRATEUR', { title: 'ASPIRATEUR' });
});
module.exports = router;
