<<<<<<< HEAD:backend/models/Service.js
// models/Service.js
=======
>>>>>>> 0cd54fc944d0c334b26f40d20537b12742613f28:models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
<<<<<<< HEAD:backend/models/Service.js
  location: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
=======
  category: { type: String, required: true },
  location: { type: String },
  available: { type: Boolean, default: true }
>>>>>>> 0cd54fc944d0c334b26f40d20537b12742613f28:models/Service.js
});

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);