const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const profileController = require('../controllers/profile.controller');

// Rotas protegidas por autenticação
router.use(isAuthenticated);

// Visualizar perfil
router.get('/', profileController.getProfile);

// Atualizar perfil
router.put('/update', profileController.updateProfile);

module.exports = router; 