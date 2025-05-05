// routes/user.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const User = require('../models/User');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ message: 'Não autorizado' });
};

// Rotas de usuário
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', {
        title: 'Meu Perfil',
        user: req.session.user
    });
});

router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.session.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        
        if (password) {
            user.password = password;
        }

        await user.save();
        res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

module.exports = router;