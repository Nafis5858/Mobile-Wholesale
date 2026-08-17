import express from 'express';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import { deleteUploadedImage, saveUploadedImage, upload } from '../utils/imageUpload.js';

const router = express.Router();

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
    const uploadedImage = await saveUploadedImage(req.file, 'mobile-wholesale/products');

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      stock,
      imageUrl: uploadedImage?.imageUrl || imageUrl || '',
      imagePublicId: uploadedImage?.imagePublicId || '',
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
      const uploadedImage = await saveUploadedImage(req.file, 'mobile-wholesale/products');
      await deleteUploadedImage(product.imagePublicId);
      product.imageUrl = uploadedImage.imageUrl;
      product.imagePublicId = uploadedImage.imagePublicId;
    } else if (imageUrl !== undefined) {
      product.imageUrl = imageUrl;
      product.imagePublicId = '';
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
    await deleteUploadedImage(product.imagePublicId);
    await product.deleteOne();
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete product.' });
  }
});

export default router;
