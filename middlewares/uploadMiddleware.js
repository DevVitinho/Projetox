const upload = require('../config/upload');

/**
 * Middleware para upload de imagem de serviço
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função next do Express
 */
const uploadServiceImage = (req, res, next) => {
  const uploadSingle = upload.single('serviceImage');

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Erro no upload de imagem:', err);
      
      // Verificar se é uma requisição AJAX
      if (req.xhr) {
        return res.status(400).json({ 
          success: false, 
          message: `Erro no upload de imagem: ${err.message}` 
        });
      }
      
      return res.status(400).send(`Erro no upload de imagem: ${err.message}`);
    }
    next();
  });
};

module.exports = {
  uploadServiceImage
}; 