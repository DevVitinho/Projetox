// app.js
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const { injectUserData } = require('./middlewares/auth.middleware');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Injetar dados do usuário em todas as views
app.use(injectUserData);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Rotas
app.use('/', require('./routes/index.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/company', require('./routes/company.routes'));
app.use('/services', require('./routes/service.routes'));
app.use('/profile', require('./routes/profile.routes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err : {},
    user: req.session.user
  });
});

// Função para tentar iniciar o servidor em diferentes portas
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Porta ${port} em uso, tentando próxima porta...`);
        startServer(port + 1);
      } else {
        console.error('Erro ao iniciar servidor:', err);
      }
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
  }
};

// Iniciar servidor
startServer(PORT);
