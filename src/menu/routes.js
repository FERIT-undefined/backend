const express = require('express');
const router = express.Router();

const listAllMeals = require('./list');
const add = require('./add/index');
const remove = require('./remove/index');
const editMeal = require('./edit/index');

router.get('/', listAllMeals);
router.post('/add', add);
router.delete('/remove/:id', remove);
router.patch('/:id', editMeal);

module.exports = router;