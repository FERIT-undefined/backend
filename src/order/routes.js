const express = require('express');
const router = express.Router();
const authenticateJWT = require('../_helpers/authenticateJWT');

const add = require('./add/index');
const list = require('./list');
const edit = require('./edit/index');
const editStatus = require('./status/index');
const orderExport = require('./export/index');

router.get('/', list.listAll);
router.get('/:table', list.listByTable);
router.get('/:table/:meal', list.listByOrderMeal);
router.post('/add', add);
router.patch('/export', orderExport);
router.patch('/:id', authenticateJWT, edit);
router.patch('/:table/:meal', editStatus);

module.exports = router;