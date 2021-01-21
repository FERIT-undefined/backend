const express = require('express');
const router = express.Router();
const authenticateJWT = require('../_helpers/authenticateJWT');

const list = require('./list');
const add = require('./add/index');
const remove = require('./remove/index');
const editMeal = require('./edit/index');

router.get('/', list.listAllMeals);
router.get('/:meal_id', list.listByMealId);
router.post('/add', authenticateJWT, add);
router.delete('/remove/:id', authenticateJWT, remove);
router.patch('/:id', authenticateJWT, editMeal);

module.exports = router;