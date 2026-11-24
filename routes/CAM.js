const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/CAM', { title: 'CAM' }));
router.post('/', (req, res) => {
    console.log(req.body);
    res.render('pages/CAM', { title: 'CAM' });
});
module.exports = router;
