const fs = require('fs');
const path = require('path');

/**
 * Serviço para gerenciar uploads e operações de arquivos
 */
class FileUploadService {
  /**
   * Salva a informação do arquivo enviado no banco de dados
   * @param {Object} file - Objeto do arquivo enviado pelo multer
   * @returns {String} O caminho relativo do arquivo para armazenamento no banco
   */
  getFilePathForDatabase(file) {
    if (!file) return null;
    return `/uploads/images/${file.filename}`;
  }

  /**
   * Exclui um arquivo do sistema de arquivos
   * @param {String} relativePath - Caminho relativo do arquivo dentro da pasta public
   * @returns {Boolean} Verdadeiro se o arquivo foi excluído com sucesso
   */
  deleteFile(relativePath) {
    try {
      if (!relativePath) return false;

      // Remove a parte '/uploads' do início do caminho, pois já está incluída no path.join
      const cleanPath = relativePath.replace(/^\/uploads/, '');

      const absolutePath = path.join(
        __dirname,
        '..',
        'public',
        'uploads',
        cleanPath
      );

      // Verificar se o arquivo existe antes de tentar excluir
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      return false;
    }
  }
}

module.exports = new FileUploadService(); 