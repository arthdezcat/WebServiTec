const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number },
  image: { type: String, required: true },
  garantia: { type: String }
});

module.exports = mongoose.model('ServicePrincipali', serviceSchema);
