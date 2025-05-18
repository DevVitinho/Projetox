// routes/service.routes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { uploadServiceImage } = require('../middlewares/uploadMiddleware');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Rota para listar todos os serviços
router.get('/', serviceController.getServices);

// Rota para exibir o formulário de novo serviço
router.get('/new', isAuthenticated, serviceController.getServiceForm);

// Rota para criar um novo serviço
router.post('/create', isAuthenticated, uploadServiceImage, serviceController.postCreateService);

// Rota para buscar serviços
router.get('/search', serviceController.getSearchForm);
router.get('/search/results', serviceController.searchServices);

// Rota para edição de serviço
router.get('/edit/:id', isAuthenticated, serviceController.getEditForm);
router.put('/edit/:id', isAuthenticated, uploadServiceImage, serviceController.updateService);

// Rota para visualizar detalhes do serviço (DEVE VIR ANTES DA ROTA DE DELETE)
router.get('/:id', serviceController.getServiceDetails);

// Rota para deletar serviço
router.delete('/:id', isAuthenticated, serviceController.deleteService);

module.exports = router;