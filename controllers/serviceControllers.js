const Celular = require('../models/Service');
const path = require('path');
const { cloudinary } = require('../middlewares/cloudinary');

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
    if (req.file && req.file.path) {
      image = req.file.path; // URL de Cloudinary
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
    const servicio = await Celular.findById(id);
    if (req.file && req.file.path) {
      image = req.file.path;
      if (servicio && servicio.image && servicio.image.includes('cloudinary.com')) {
        const publicId = servicio.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy('webservitec/' + publicId);
      }
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
    const servicio = await Celular.findById(id);
    if (servicio && servicio.image && servicio.image.includes('cloudinary.com')) {
      const publicId = servicio.image.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy('webservitec/' + publicId);
    }
    await Celular.findByIdAndDelete(id);
    res.redirect('/admin/services');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el servicio');
  }
};
