const express = require('express');
const router = express.Router();

const add = require('./add/index');
const remove = require('./remove/index');

router.post('/add', add);
router.delete('/remove/:id', remove);

module.exports = router;