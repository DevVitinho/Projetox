// controllers/home.controller.js
exports.getHome = (req, res) => {
    res.render('home', {
        title: 'Página Inicial',
        user: req.session.user
    });
};