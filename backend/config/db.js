const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
<<<<<<< HEAD:backend/config/db.js
    console.log('conectado com ProjetoX');
=======
    console.log('✅ Conectado ao MongoDB');
>>>>>>> 0cd54fc944d0c334b26f40d20537b12742613f28:config/db.js
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;