import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

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

const router = express.Router();
const uploadedImagePath = (file) => `/uploads/${file.filename}`;

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch product.' });
  }
});

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access is required.' });
  }
  next();
};

router.post('/', auth, requireAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, brand, description, price, stock, imageUrl } = req.body;
    if (!name || !brand || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, brand, price, and stock are required.' });
    }
    const finalImageUrl = req.file ? uploadedImagePath(req.file) : imageUrl;

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      stock,
      imageUrl: finalImageUrl,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Could not create product.' });
  }
});

router.put('/:id', auth, requireAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, brand, description, price, stock, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (req.file) {
      product.imageUrl = uploadedImagePath(req.file);
    } else if (imageUrl !== undefined) {
      product.imageUrl = imageUrl;
    }
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Could not update product.' });
  }
});

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete product.' });
  }
});

export default router;
