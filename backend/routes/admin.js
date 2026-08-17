import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../middleware/auth.js';
import SiteSetting from '../models/SiteSetting.js';
import GalleryImage from '../models/GalleryImage.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
      cb(null, `${Date.now()}-${safeName}`);
    },
  }),
});
const uploadedImagePath = (file) => `/uploads/${file.filename}`;

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is required.' });
  }
  next();
};

router.get('/site', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch site settings.' });
  }
});

router.put('/site/contact', auth, requireAdmin, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    settings.contact.email = req.body.email || settings.contact.email;
    settings.contact.phone = req.body.phone || settings.contact.phone;
    settings.contact.address = req.body.address || settings.contact.address;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Could not update contact information.' });
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch gallery images.' });
  }
});

router.post('/gallery', auth, requireAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    const finalImageUrl = req.file ? uploadedImagePath(req.file) : imageUrl;
    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Gallery image is required.' });
    }
    const image = await GalleryImage.create({ title, imageUrl: finalImageUrl });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Could not create gallery image.' });
  }
});

router.delete('/gallery/:id', auth, requireAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found.' });
    }
    await image.deleteOne();
    res.json({ message: 'Gallery image deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete gallery image.' });
  }
});

export default router;
