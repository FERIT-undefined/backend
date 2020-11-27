const express = require('express');
const router = express.Router();
const add = require('./add/index.js');

router.post('/add', add);

module.exports = router;