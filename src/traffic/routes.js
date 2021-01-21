const express = require('express');
const router = express.Router();

const select = require('./select/index');
router.get('/:start/:end', select);

module.exports = router;