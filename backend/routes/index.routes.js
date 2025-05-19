// routes/index.routes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');
const authController = require('../controllers/auth.controller');

// Rotas públicas
router.get('/', homeController.getHome);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;
