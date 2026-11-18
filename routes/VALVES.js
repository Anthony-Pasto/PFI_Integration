const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/VALVES', { title: 'VALVES' }));
router.post('/', (req, res) => {
    console.log(req.body);
    res.render('pages/VALVES', { title: 'VALVES' });
});
module.exports = router;
