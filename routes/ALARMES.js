const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/ALARMES', { title: 'ALARMES' }));
router.post('/', (req, res) => {
  console.log(req.body);
  res.render('pages/ALARMES', { title: 'ALARMES' });
});
module.exports = router;
