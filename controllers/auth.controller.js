// controllers/auth.controller.js
const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Login',
    user: req.session.user
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Escolher o modelo correto baseado no tipo de usuário
    const Model = userType === 'user' ? User : Company;
    
    // Buscar usuário
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Criar sessão
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      type: userType
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

exports.getRegister = (req, res) => {
  res.render('register', {
    title: 'Cadastro',
    user: req.session.user
  });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, userType } = req.body;
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    // Escolher o modelo correto baseado no tipo de usuário
    const Model = userType === 'user' ? User : Company;
    
    // Verificar se o usuário já existe
    let user = await Model.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criar novo usuário
    user = new Model({
      name,
      email,
      password
    });

    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
