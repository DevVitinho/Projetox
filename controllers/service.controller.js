// controllers/service.controller.js
const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.render('services/list', { services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar serviços');
  }
};

exports.getServiceForm = (req, res) => {
  res.render('services/form');
};

exports.postCreateService = async (req, res) => {
  const { name, description, category, price, location } = req.body;

  try {
    const service = new Service({
      companyId: '667f8c4d3b94cd2e38d8d3aa', // Exemplo - depois virá da sessão
      name,
      description,
      category,
      price,
      location
    });

    await service.save();
    res.redirect('/services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar serviço');
  }
};