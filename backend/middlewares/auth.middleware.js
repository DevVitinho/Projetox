// middlewares/auth.middleware.js

// Middleware para verificar se o usuário está autenticado
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Middleware para verificar se o usuário NÃO está autenticado (para páginas de login/registro)
exports.isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next();
    }
    res.redirect('/');
};

// Middleware para verificar se é um usuário comum
exports.isUser = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.type === 'user') {
        return next();
    }
    res.status(403).render('error', {
        message: 'Acesso negado. Apenas usuários podem acessar esta página.',
        user: req.session.user
    });
};

// Middleware para verificar se é uma empresa
exports.isCompany = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.type === 'company') {
        return next();
    }
    res.status(403).render('error', {
        message: 'Acesso negado. Apenas empresas podem acessar esta página.',
        user: req.session.user
    });
};

// Middleware para injetar informações do usuário em todas as views
exports.injectUserData = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
}; 