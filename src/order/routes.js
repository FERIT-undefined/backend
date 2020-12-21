const express = require('express');
const router = express.Router();
const authenticateJWT = require('../_helpers/authenticateJWT');

const add = require('./add/index');
const list = require('./list');
//const remove = require('./remove/index');
const edit = require('./edit/index');
const editStatus = require('./status/index');

router.get('/', list.listAll);
router.get('/:table', list.listByTable);
router.get('/:table/:meal', list.listByOrderMeal);
router.post('/add', authenticateJWT, add);
//router.delete('/remove/:id', authenticateJWT, remove);
router.patch('/:id', authenticateJWT, edit);
router.patch('/:table/:meal', authenticateJWT, editStatus);

module.exports = router;