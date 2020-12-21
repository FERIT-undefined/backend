const express = require('express');
const router = express.Router();
//const authenticateJWT = require('../_helpers/authenticateJWT');

const add = require('./add/index');

//router.get('/', listAllMeals);
router.post('/add', add);

module.exports = router;