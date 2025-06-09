const HomeInfo = require('../models/HomeInfo');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { cloudinary } = require('../middlewares/cloudinary');

// Redirige a la vista principal de admin si se intenta acceder a /admin/homeinfo directamente
exports.getHomeInfo = async (req, res) => {
  try {
    let homeInfo = await HomeInfo.findOne();
    if (!homeInfo) {
      homeInfo = { nombreLocal: '', slogan: '', descripcion: '', telefono: '', direccion: '', email: '', logoUrl: '', iconUrl: '' };
    }
    // Renderiza la vista principal de admin (index.ejs) en vez de una vista inexistente
    res.render('admin/index', { title: 'Editar Inicio', homeInfo });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la información de inicio');
  }
};

// Actualizar información de inicio
exports.updateHomeInfo = async (req, res) => {
  try {
    const { nombreLocal, slogan, descripcion, telefono, direccion, email, logoUrl, iconUrl, TituloServicio1, TituloServicio2, colorFondo, fondoUrl } = req.body;
    let homeInfo = await HomeInfo.findOne();
    // Procesar archivos subidos o URLs
    let logoPath = logoUrl;
    let iconPath = iconUrl;
    // Procesar imágenes de fondo subidas (fondoFiles)
    let fondoFiles = [];
    if (req.files && req.files['fondoFiles']) {
      // Subir cada imagen a Cloudinary si no es ya una URL de Cloudinary
      for (const file of req.files['fondoFiles']) {
        if (file.path && !file.path.includes('cloudinary.com')) {
          // Ya está en Cloudinary por multer-storage-cloudinary
          fondoFiles.push(file.path);
        } else if (file.url) {
          fondoFiles.push(file.url);
        }
      }
    }

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
      homeInfo = new HomeInfo({ nombreLocal, slogan, descripcion, telefono, direccion, email, logoUrl: logoPath, iconUrl: iconPath, TituloServicio1, TituloServicio2, colorFondo, fondoUrl, fondoFiles });
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
      homeInfo.colorFondo = colorFondo;
      homeInfo.fondoUrl = fondoUrl;
      if (fondoFiles && fondoFiles.length > 0) homeInfo.fondoFiles = fondoFiles;
    }
    await homeInfo.save();
    res.redirect('/admin/homeinfo');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la información de inicio');
  }
};
