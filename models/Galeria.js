const mongoose = require('mongoose');

const ofertaSchema = new mongoose.Schema({  
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number }, // Nuevo: precio opcional
  image: { type: String, required: true },
  garantia: { type: String } // Nuevo: garantía
});

module.exports = mongoose.model('ServiceSecundary', ofertaSchema);