const Company = require('../models/Company');
const Service = require('../models/Service');

// Listar todas as empresas
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select('-password');
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar empresas' });
    }
};

// Buscar empresa por ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).select('-password');
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar empresa' });
    }
};

// Atualizar empresa
exports.updateCompany = async (req, res) => {
    try {
        const { name, email, cnpj, categories } = req.body;
        const companyId = req.params.id;

        // Verificar se a empresa existe
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        // Verificar se o email já está em uso
        if (email !== company.email) {
            const existingCompany = await Company.findOne({ email });
            if (existingCompany) {
                return res.status(400).json({ message: 'Este email já está em uso' });
            }
        }

        // Verificar se o CNPJ já está em uso
        if (cnpj !== company.cnpj) {
            const existingCompany = await Company.findOne({ cnpj });
            if (existingCompany) {
                return res.status(400).json({ message: 'Este CNPJ já está cadastrado' });
            }
        }

        // Atualizar dados
        company.name = name || company.name;
        company.email = email || company.email;
        company.cnpj = cnpj || company.cnpj;
        if (categories) {
            company.categories = categories;
        }

        await company.save();
        res.json({ message: 'Empresa atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar empresa' });
    }
};

// Deletar empresa
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }

        // Deletar todos os serviços associados à empresa
        await Service.deleteMany({ companyId: req.params.id });

        res.json({ message: 'Empresa e seus serviços foram deletados com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar empresa' });
    }
};

// Listar serviços de uma empresa
exports.getCompanyServices = async (req, res) => {
    try {
        const services = await Service.find({ companyId: req.params.id });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar serviços da empresa' });
    }
};

// Buscar empresas por categoria
exports.getCompaniesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const companies = await Company.find({ categories: category }).select('-password');
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar empresas por categoria' });
    }
};
