const express = require('express');
const router = express.Router();

// Exemplo de rota da API
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do ProjetoX' });
});

module.exports = router; 