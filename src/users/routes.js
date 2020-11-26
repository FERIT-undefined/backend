const express = require('express');
const router = express.Router();
const { validateLoginUser, validateRegisterUser } = require('../_helpers/validation');
const { Router } = require('express');
const authenticateJWT = require('../_helpers/authenticateJWT')
const login = require('./auth/login')
const register = require('./auth/register')
const logout = require('./auth/logout')
const remove = require('./remove/remove')
const list = require('./list/list')

router.get('/', authenticateJWT, list);
router.post('/register', validateRegisterUser, register);
router.post('/login', validateLoginUser, login);
router.post('/logout', logout);
router.delete('/remove/:id', authenticateJWT, remove);

module.exports = router;