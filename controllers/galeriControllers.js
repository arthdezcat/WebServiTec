const ComputadoraLaptop = require('../models/Galeria'); // Ahora es ComputadoraLaptop
const path = require('path');

// Obtener todas las ofertas
exports.getGaleria = async (req, res) => {
  try {
    const computadoras = await ComputadoraLaptop.find();
    res.render('pages/galeri', { galeria: computadoras, homeInfo: res.locals.homeInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las ofertas');
  }
};

// Obtener solo las imágenes de galería para el slider de ofertas en home
exports.getGaleriaImages = async (req, res, next) => {
  try {
    const galeriaImages = await ComputadoraLaptop.find({}, 'image title');
    res.locals.galeriaImages = galeriaImages;
    next();
  } catch (error) {
    console.error('Error al obtener imágenes de galería:', error);
    res.locals.galeriaImages = [];
    next();
  }
};

// Añadir una nueva oferta
exports.addGaleria = async (req, res) => {
  try {
    let image = req.body.image;
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const { title, description, tipo, fechaInicio, fechaFin, porcentaje, especial } = req.body;
    const newComputadora = new ComputadoraLaptop({ title, description, image, tipo, fechaInicio, fechaFin, porcentaje, especial });
    await newComputadora.save();
    res.redirect('/admin/galeria');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar la oferta');
  }
};

// Actualizar una oferta
exports.updateGaleria = async (req, res) => {
  try {
    const { id } = req.params;
    let image = req.body.image;
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const { title, description, tipo, fechaInicio, fechaFin, porcentaje, especial } = req.body;
    await ComputadoraLaptop.findByIdAndUpdate(id, { title, description, image, tipo, fechaInicio, fechaFin, porcentaje, especial });
    res.redirect('/admin/galeria');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la oferta');
  }
};

// Eliminar una oferta
exports.deleteGaleria = async (req, res) => {
  try {
    const { id } = req.params;
    await ComputadoraLaptop.findByIdAndDelete(id);
    res.redirect('/admin/galeria');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la oferta');
  }
};