const express = require('express');
const router = express.Router();
//const authenticateJWT = require('../_helpers/authenticateJWT');

const select = require('./select/index');

router.get('/:start/:end', select);

module.exports = router;