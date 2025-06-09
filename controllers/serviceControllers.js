const Celular = require('../models/Service');
const path = require('path');

// Obtener todos los servicios
exports.getServices = async (req, res) => {
  try {
    const celulares = await Celular.find();
    res.render('pages/services', { services: celulares, homeInfo: res.locals.homeInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los servicios');
  }
};

// Añadir un nuevo servicio
exports.addService = async (req, res) => {
  try {
    let image = req.body.image;
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const { title, description, price, cantidad, colores, tallas } = req.body;
    const coloresArray = colores ? colores.split(',').map(c => c.trim()) : [];
    const tallasArray = tallas ? tallas.split(',').map(t => t.trim()) : [];
    const newCelular = new Celular({
      title,
      description,
      price,
      image,
      cantidad,
      colores: coloresArray,
      tallas: tallasArray
    });
    await newCelular.save();
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el servicio');
  }
};

// Actualizar un servicio
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    let image = req.body.image;
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }
    const { title, description, price, cantidad, colores, tallas } = req.body;
    const coloresArray = colores ? colores.split(',').map(c => c.trim()) : [];
    const tallasArray = tallas ? tallas.split(',').map(t => t.trim()) : [];
    await Celular.findByIdAndUpdate(id, {
      title,
      description,
      price,
      image,
      cantidad,
      colores: coloresArray,
      tallas: tallasArray
    });
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el servicio');
  }
};

// Eliminar un servicio
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Celular.findByIdAndDelete(id);
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el servicio');
  }
};
