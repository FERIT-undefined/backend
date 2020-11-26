const express = require('express');
const router = express.Router();
const { Router } = require('express');
const authenticateJWT = require('../_helpers/authenticateJWT')
const login = require('./auth/login')
const register = require('./auth/register')
const logout = require('./auth/logout')
const remove = require('./remove/remove')

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/remove/:id', authenticateJWT, remove);

module.exports = router;