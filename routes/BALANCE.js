const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.render('pages/BALANCE', { title: 'BALANCE' }));
router.post('/', (req, res) => {
  console.log(req.body);
  res.render('pages/BALANCE', { title: 'BALANCE' });
});
module.exports = router;
