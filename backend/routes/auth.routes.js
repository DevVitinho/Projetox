const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isNotAuthenticated } = require('../middlewares/auth.middleware');

// Rotas de login
router.get('/login', isNotAuthenticated, authController.getLogin);
router.post('/login', isNotAuthenticated, authController.postLogin);

// Rotas de registro
router.get('/register', isNotAuthenticated, authController.getRegister);
router.post('/register', isNotAuthenticated, authController.postRegister);

// Rota de logout
router.post('/logout', authController.logout);

module.exports = router; 