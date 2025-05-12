const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);