const User = require('../models/User');
const Company = require('../models/Company');

// Exibir perfil
exports.getProfile = async (req, res) => {
    try {
        const Model = req.session.user.type === 'user' ? User : Company;
        const profile = await Model.findById(req.session.user.id).select('-password');

        res.render('profile', {
            title: 'Meu Perfil',
            profile,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {
            message: 'Erro ao carregar perfil',
            user: req.session.user
        });
    }
};

// Atualizar perfil
exports.updateProfile = async (req, res) => {
    try {
        const Model = req.session.user.type === 'user' ? User : Company;
        const { name, email, phone } = req.body;

        const profile = await Model.findById(req.session.user.id);

        // Verificar se o email já está em uso por outro usuário
        if (email !== profile.email) {
            const existingUser = await Model.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Este email já está em uso' });
            }
        }

        // Atualizar dados básicos
        profile.name = name;
        profile.email = email;
        profile.phone = phone;

        // Campos específicos para empresa
        if (req.session.user.type === 'company') {
            const { address } = req.body;
            profile.address = address;
        }

        await profile.save();

        // Atualizar dados da sessão
        req.session.user = {
            ...req.session.user,
            name,
            email
        };

        res.json({ message: 'Perfil atualizado com sucesso', redirect: '/' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
}; 