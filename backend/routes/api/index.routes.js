const express = require('express');
const router = express.Router();
const chatbotController = require('../../controllers/chatbot.controller');

// Exemplo de rota da API
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do ProjetoX' });
});

router.post('/chatbot', chatbotController.chat);

module.exports = router; 