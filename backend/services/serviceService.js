const Service = require('../models/Service');
const fileUploadService = require('./fileUploadService');

/**
 * Serviço para gerenciar operações de negócios relacionadas a serviços
 */
class ServiceService {
  /**
   * Obtém todos os serviços cadastrados
   * @returns {Promise<Array>} Lista de serviços
   */
  async getAllServices() {
    try {
      return await Service.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }
  }

  /**
   * Busca serviços com base em critérios específicos
   * @param {Object} criteria - Critérios de busca (palavra-chave, categoria, localização)
   * @returns {Promise<Array>} Lista de serviços que correspondem aos critérios
   */
  async searchServices(criteria) {
    try {
      const { keyword, category, location } = criteria;
      const query = {};

      // Se tiver palavra-chave, busca no nome e descrição
      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }

      // Filtrar por categoria, se fornecida
      if (category) {
        query.category = category;
      }

      // Filtrar por localização, se fornecida
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      // Executar a consulta
      return await Service.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }
  }

  /**
   * Encontra um serviço por ID
   * @param {String} id - ID do serviço
   * @returns {Promise<Object>} Serviço encontrado
   */
  async getServiceById(id) {
    try {
      const service = await Service.findById(id);
      if (!service) {
        throw new Error('Serviço não encontrado');
      }
      return service;
    } catch (error) {
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }
  }

  /**
   * Cria um novo serviço
   * @param {Object} serviceData - Dados do serviço
   * @param {Object} file - Arquivo de imagem enviado (opcional)
   * @returns {Promise<Object>} Serviço criado
   */
  async createService(serviceData, file) {
    try {
      const newServiceData = { ...serviceData };

      // Se houver um arquivo enviado, adicione o caminho ao objeto
      if (file) {
        newServiceData.imageUrl = fileUploadService.getFilePathForDatabase(file);
      }

      // Criar e salvar o serviço
      const service = new Service(newServiceData);
      return await service.save();
    } catch (error) {
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }
  }

  /**
   * Atualiza um serviço existente
   * @param {String} id - ID do serviço
   * @param {Object} serviceData - Novos dados do serviço
   * @param {Object} file - Novo arquivo de imagem enviado (opcional)
   * @returns {Promise<Object>} Serviço atualizado
   */
  async updateService(id, serviceData, file) {
    try {
      // Buscar o serviço existente
      const service = await this.getServiceById(id);
      const updateData = { ...serviceData };

      // Se houver um novo arquivo enviado
      if (file) {
        // Se já existir uma imagem, excluí-la
        if (service.imageUrl) {
          fileUploadService.deleteFile(service.imageUrl);
        }
        
        // Atualizar com o novo caminho de imagem
        updateData.imageUrl = fileUploadService.getFilePathForDatabase(file);
      }

      // Atualizar o serviço e retornar o atualizado
      return await Service.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Erro ao atualizar serviço: ${error.message}`);
    }
  }

  /**
   * Exclui um serviço
   * @param {String} id - ID do serviço a ser excluído
   * @returns {Promise<Boolean>} Verdadeiro se a exclusão foi bem-sucedida
   */
  async deleteService(id) {
    try {
      // Buscar o serviço para verificar se há imagem para excluir
      const service = await this.getServiceById(id);

      // Se o serviço tiver uma imagem, excluí-la
      if (service.imageUrl) {
        fileUploadService.deleteFile(service.imageUrl);
      }

      // Excluir o serviço do banco de dados
      await Service.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir serviço: ${error.message}`);
    }
  }
}

module.exports = new ServiceService(); 