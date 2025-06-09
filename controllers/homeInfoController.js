const HomeInfo = require('../models/HomeInfo');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { cloudinary } = require('../middlewares/cloudinary');

// Mostrar formulario de edición de información de inicio
exports.getHomeInfo = async (req, res) => {
  try {
    let homeInfo = await HomeInfo.findOne();
    // Si no existe, no lo crees aquí, solo envía un objeto vacío para el formulario
    if (!homeInfo) {
      homeInfo = { nombreLocal: '', slogan: '', descripcion: '', telefono: '', direccion: '', email: '', logoUrl: '', iconUrl: '' };
    }
    res.render('admin/homeinfo', { title: 'Editar Inicio', homeInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la información de inicio');
  }
};

// Actualizar información de inicio
exports.updateHomeInfo = async (req, res) => {
  try {
    const { nombreLocal, slogan, descripcion, telefono, direccion, email, logoUrl, iconUrl, TituloServicio1, TituloServicio2 } = req.body;
    let homeInfo = await HomeInfo.findOne();
    // Procesar archivos subidos o URLs
    let logoPath = logoUrl;
    let iconPath = iconUrl;

    // Función para procesar imagen circular con fondo transparente
    async function processCircularImage(inputPath, outputPath, size = 160) {
      await sharp(inputPath)
        .resize(size, size)
        .composite([
          {
            input: Buffer.from(
              `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`
            ),
            blend: 'dest-in'
          }
        ])
        .png()
        .toFile(outputPath);
    }

    // Procesar logo subido
    if (req.files && req.files['logoFile'] && req.files['logoFile'][0] && req.files['logoFile'][0].path) {
      // Eliminar logo anterior si se sube uno nuevo
      if (homeInfo && homeInfo.logoUrl && homeInfo.logoUrl.includes('cloudinary.com')) {
        const publicId = homeInfo.logoUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy('webservitec/' + publicId);
      }
      logoPath = req.files['logoFile'][0].path; // URL de Cloudinary
    } else if (logoUrl && logoUrl.startsWith('http')) {
      logoPath = logoUrl;
    }
    // Procesar icono subido
    if (req.files && req.files['iconFile'] && req.files['iconFile'][0] && req.files['iconFile'][0].path) {
      // Eliminar icono anterior si se sube uno nuevo
      if (homeInfo && homeInfo.iconUrl && homeInfo.iconUrl.includes('cloudinary.com')) {
        const publicId = homeInfo.iconUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy('webservitec/' + publicId);
      }
      iconPath = req.files['iconFile'][0].path; // URL de Cloudinary
    } else if (iconUrl && iconUrl.startsWith('http')) {
      iconPath = iconUrl;
    } else if (logoPath && !iconUrl) {
      // Si no se subió icono, usar el logo procesado pero en tamaño favicon
      const logoInputPath = path.join(__dirname, '../public', logoPath);
      const outputFile = 'favicon-' + Date.now() + '.png';
      const outputPath = path.join(__dirname, '../public/uploads', outputFile);
      await processCircularImage(logoInputPath, outputPath, 96);
      iconPath = '/uploads/' + outputFile;
    }

    if (!homeInfo) {
      homeInfo = new HomeInfo({ nombreLocal, slogan, descripcion, telefono, direccion, email, logoUrl: logoPath, iconUrl: iconPath, TituloServicio1, TituloServicio2 });
    } else {
      homeInfo.nombreLocal = nombreLocal;
      homeInfo.slogan = slogan;
      homeInfo.descripcion = descripcion;
      homeInfo.telefono = telefono;
      homeInfo.direccion = direccion;
      homeInfo.email = email;
      homeInfo.logoUrl = logoPath;
      homeInfo.iconUrl = iconPath;
      homeInfo.TituloServicio1 = TituloServicio1;
      homeInfo.TituloServicio2 = TituloServicio2;
    }
    await homeInfo.save();
    res.redirect('/admin/homeinfo');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la información de inicio');
  }
};
