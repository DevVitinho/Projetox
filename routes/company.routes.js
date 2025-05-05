const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.user.type === 'company') {
        return next();
    }
    res.status(401).json({ message: 'Não autorizado' });
};

// Rotas de empresa
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const company = await Company.findById(req.session.user.id);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.render('company/profile', {
            title: 'Perfil da Empresa',
            company
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao carregar perfil' });
    }
});

router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { name, email, cnpj, phone, address } = req.body;
        const companyId = req.session.user.id;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        company.name = name || company.name;
        company.email = email || company.email;
        company.cnpj = cnpj || company.cnpj;
        company.phone = phone || company.phone;
        
        if (address) {
            company.address = {
                ...company.address,
                ...address
            };
        }

        await company.save();
        res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
});

module.exports = router; 