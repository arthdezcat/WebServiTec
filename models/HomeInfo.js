const mongoose = require('mongoose');

const homeInfoSchema = new mongoose.Schema({
  nombreLocal: { type: String, required: true },
  slogan: { type: String, required: true },
  descripcion: { type: String },
  telefono: { type: String },
  direccion: { type: String },
  email: { type: String },
  logoUrl: { type: String }, // URL o ruta del logo
  iconUrl: { type: String }, // URL o ruta del icono para el favicon
  TituloServicio1: { type: String, default: 'TituloServicio1' },
  TituloServicio2: { type: String, default: 'TituloServicio2' },
  colorFondo: { type: String }, // Color de fondo (hex)
  fondoUrl: { type: String }, // URL de imagen de fondo
  fondoFiles: [{ type: String }], // Rutas de imágenes subidas para fondo
  // Puedes agregar más campos según lo que quieras mostrar en la página de inicio
}, { timestamps: true });

module.exports = mongoose.model('HomeInfo', homeInfoSchema);
