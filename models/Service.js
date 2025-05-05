 // models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String }
});

module.exports = mongoose.model('Service', ServiceSchema);