const express = require('express');
const router = express.Router();
const authenticateJWT = require('../_helpers/authenticateJWT');

const add = require('./add/index');
//const listAllMeals = require('./list');
//const remove = require('./remove/index');
//const editMeal = require('./edit/index');

//router.get('/', listAllMeals);
router.post('/add', authenticateJWT, add);
//router.delete('/remove/:id', authenticateJWT, remove);
//router.patch('/:id', authenticateJWT, editMeal);

module.exports = router;