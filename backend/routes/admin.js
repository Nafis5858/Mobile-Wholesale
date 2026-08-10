import express from 'express';
import auth from '../middleware/auth.js';
import SiteSetting from '../models/SiteSetting.js';
import GalleryImage from '../models/GalleryImage.js';

const router = express.Router();

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

router.post('/gallery', auth, requireAdmin, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required.' });
    }
    const image = await GalleryImage.create({ title, imageUrl });
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
