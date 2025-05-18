// controllers/service.controller.js
const serviceService = require('../services/serviceService');
const Service = require('../models/Service');
const Company = require('../models/Company');

/**
 * Exibe a lista de todos os serviços
 */
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('companyId', 'name email')
            .sort('-createdAt');

        res.render('services/index', {
            title: 'Serviços',
            services,
            user: req.session.user
        });
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao carregar serviços',
            user: req.session.user
        });
    }
};

/**
 * Exibe o formulário para criar um novo serviço
 */
exports.getServiceForm = (req, res) => {
    // Verificar se o usuário é uma empresa
    if (!req.session.user || req.session.user.type !== 'company') {
        return res.status(403).render('error', {
            title: 'Acesso Negado',
            message: 'Apenas empresas podem cadastrar serviços',
            user: req.session.user
        });
    }

    res.render('services/form', {
        title: 'Adicionar Serviço',
        user: req.session.user
    });
};

/**
 * Cria um novo serviço a partir dos dados do formulário
 */
exports.postCreateService = async (req, res) => {
    try {
        // Verificar se o usuário é uma empresa
        if (!req.session.user || req.session.user.type !== 'company') {
            return res.status(403).json({ message: 'Apenas empresas podem cadastrar serviços' });
        }

        const { name, description, category, price, location } = req.body;

        // Verificar se a empresa existe
        const company = await Company.findById(req.session.user.id);
        if (!company) {
            return res.status(404).render('error', {
                title: 'Erro',
                message: 'Empresa não encontrada',
                user: req.session.user
            });
        }

        // Criar o serviço
        const service = new Service({
            companyId: company._id,
            name,
            description,
            category,
            price: parseFloat(price),
            location
        });

        // Se houver upload de imagem
        if (req.file) {
            service.imageUrl = '/uploads/images/' + req.file.filename;
        }

        await service.save();
        res.redirect('/services');
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao criar serviço',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user
        });
    }
};

/**
 * Busca serviços com base em critérios
 */
exports.searchServices = async (req, res) => {
    try {
        const { keyword, category, location } = req.query;
        const criteria = { keyword, category, location };

        // Executar a busca usando o serviço
        const services = await serviceService.searchServices(criteria);

        // Verificar se algum filtro foi aplicado
        const filtrosAplicados = keyword || category || location;

        // Renderizar a página de busca com os resultados
        res.render('services/search', {
            services,
            query: req.query,
            filtrosAplicados
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Erro ao buscar serviços: ${err.message}`);
    }
};

/**
 * Exibe o formulário de busca vazio
 */
exports.getSearchForm = (req, res) => {
    res.render('services/search', {
        services: [],
        query: {},
        filtrosAplicados: false
    });
};

/**
 * Exclui um serviço pelo ID
 */
exports.deleteService = async (req, res) => {
    try {
        // Verificar se o usuário é uma empresa
        if (!req.session.user || req.session.user.type !== 'company') {
            return res.status(403).json({ message: 'Apenas empresas podem excluir serviços' });
        }

        const serviceId = req.params.id;

        // Buscar o serviço com os dados da empresa
        const service = await Service.findById(serviceId).populate('companyId');

        if (!service) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        // Verificar se o usuário logado é o dono do serviço
        if (service.companyId._id.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Você não tem permissão para excluir este serviço' });
        }

        // Se houver uma imagem, excluí-la
        if (service.imageUrl) {
            const fileUploadService = require('../services/fileUploadService');
            fileUploadService.deleteFile(service.imageUrl);
        }

        await service.deleteOne();

        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ success: true });
        }

        res.redirect('/services');
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao excluir serviço',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user
        });
    }
};

// Exibir detalhes do serviço
exports.getServiceDetails = async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Buscar o serviço com populate completo dos dados da empresa
        const service = await Service.findById(serviceId)
            .populate({
                path: 'companyId',
                model: 'Company',
                select: 'name email phone address'
            });

        if (!service) {
            return res.status(404).render('error', {
                title: 'Erro',
                message: 'Serviço não encontrado',
                user: req.session.user
            });
        }

        // Verificar se os dados da empresa foram carregados
        if (!service.companyId) {
            return res.status(404).render('error', {
                title: 'Erro',
                message: 'Dados da empresa não encontrados',
                user: req.session.user
            });
        }

        res.render('services/details', {
            title: service.name,
            service,
            user: req.session.user
        });
    } catch (error) {
        console.error('Erro ao carregar detalhes do serviço:', error);
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao carregar detalhes do serviço',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user
        });
    }
};

/**
 * Exibe o formulário de edição de serviço
 */
exports.getEditForm = async (req, res) => {
    try {
        // Verificar se o usuário é uma empresa
        if (!req.session.user || req.session.user.type !== 'company') {
            return res.status(403).render('error', {
                title: 'Acesso Negado',
                message: 'Apenas empresas podem editar serviços',
                user: req.session.user
            });
        }

        const serviceId = req.params.id;

        // Buscar o serviço com os dados da empresa
        const service = await Service.findById(serviceId).populate('companyId');

        if (!service) {
            return res.status(404).render('error', {
                title: 'Erro',
                message: 'Serviço não encontrado',
                user: req.session.user
            });
        }

        // Verificar se o usuário logado é o dono do serviço
        if (service.companyId._id.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                title: 'Acesso Negado',
                message: 'Você não tem permissão para editar este serviço',
                user: req.session.user
            });
        }

        res.render('services/edit', {
            title: 'Editar Serviço',
            service,
            user: req.session.user
        });
    } catch (error) {
        console.error('Erro ao carregar formulário de edição:', error);
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao carregar formulário de edição',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user
        });
    }
};

/**
 * Atualiza um serviço existente
 */
exports.updateService = async (req, res) => {
    try {
        // Verificar se o usuário é uma empresa
        if (!req.session.user || req.session.user.type !== 'company') {
            return res.status(403).json({ message: 'Apenas empresas podem editar serviços' });
        }

        const serviceId = req.params.id;
        const { name, description, category, price, location } = req.body;

        // Buscar o serviço com os dados da empresa
        const service = await Service.findById(serviceId).populate('companyId');

        if (!service) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        // Verificar se o usuário logado é o dono do serviço
        if (service.companyId._id.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Você não tem permissão para editar este serviço' });
        }

        // Atualizar os dados do serviço
        service.name = name;
        service.description = description;
        service.category = category;
        service.price = parseFloat(price);
        service.location = location;

        // Se houver upload de nova imagem
        if (req.file) {
            // Se já existir uma imagem, excluí-la
            if (service.imageUrl) {
                const fileUploadService = require('../services/fileUploadService');
                fileUploadService.deleteFile(service.imageUrl);
            }
            service.imageUrl = '/uploads/images/' + req.file.filename;
        }

        await service.save();

        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ success: true });
        }

        res.redirect('/services/' + serviceId);
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(500).json({
                success: false,
                message: error.message || 'Erro ao atualizar serviço'
            });
        }
        res.status(500).render('error', {
            title: 'Erro',
            message: 'Erro ao atualizar serviço',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: req.session.user
        });
    }
};