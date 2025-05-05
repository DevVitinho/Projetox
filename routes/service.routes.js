// routes/service.routes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.get('/services', serviceController.getServices);
router.get('/services/new', serviceController.getServiceForm);
router.post('/services', serviceController.postCreateService);

module.exports = router;