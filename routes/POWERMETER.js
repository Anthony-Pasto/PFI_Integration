const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/POWERMETER', { title: 'POWERMETER' }));
router.post('/', (req, res) => {
  console.log(req.body);
  res.render('pages/POWERMETER', { title: 'POWERMETER' });
});
module.exports = router;
