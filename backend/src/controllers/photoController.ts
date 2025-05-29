import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Photo } from '../models/Photo';

// Configure multer to save files to /public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '../public/uploads');
    // ensure directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    cb(null, `${name}-${timestamp}${ext}`);
  },
});

// Middleware to handle single file upload under 'image' field
export const uploadMiddleware = multer({ storage }).single('image');

// Create a new photo record, saving file locally
// controllers/photoController.ts

export const createPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title, description, event, tags, dateTaken } = req.body;
    const filename = req.file.filename;

    // 1) Ruta relativa dentro de tu carpeta estática
    const urlPath = `/uploads/${filename}`;
    // 2) URL absoluta basada en el host que está sirviendo tu API
    const fullUrl = `${req.protocol}://${req.get('host')}${urlPath}`;

    // Persistimos la metadata, usando fullUrl en lugar de la ruta relativa
    const photo = await Photo.create({
      user: req.user!.id,
      filePath: req.file.path,
      url: fullUrl,
      thumbnailUrl: fullUrl,       // si luego generas thumbnails, ajusta aquí
      title: title || path.basename(filename, path.extname(filename)),
      description: description || '',
      tags: tags ? JSON.parse(tags) : [],
      event,
      dateTaken: dateTaken ? new Date(dateTaken) : new Date(),
      uploadDate: new Date(),
    });

    // Ahora el objeto photo.data tendrá photo.url = "http://tu-host:puerto/uploads/mi-foto-123.jpg"
    return res.status(201).json({ data: photo });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


// Get all user photos
export const getAllPhotos = async (req: Request, res: Response) => {
  try {
    const photos = await Photo.find({ user: req.user!.id }).sort({ uploadDate: -1 });
    console.log(photos)
    res.json({ data: photos });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update photo metadata (not file)
export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const photo = await Photo.findOneAndUpdate(
      { _id: id, user: req.user!.id },
      updateData,
      { new: true }
    );

    if (!photo) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    res.json({ data: photo });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a photo and its local file
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const photo = await Photo.findOneAndDelete({ _id: id, user: req.user!.id });
    if (!photo) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    // Remove file from disk
    fs.unlink(photo.filePath, (err) => {
      if (err) console.warn('Error deleting file:', err);
    });

    res.json({ message: 'Foto eliminada' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};