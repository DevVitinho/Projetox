const Service = require('../../models/Service');

exports.getAll = async (req, res) => {
  try {
    const services = await Service.find().populate('companyId');
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
};

exports.getById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
};