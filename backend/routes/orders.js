import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Place a new order
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available.' });
    }

    product.stock -= quantity;
    await product.save();

    const totalPrice = product.price * quantity;
    const order = await Order.create({
      user: req.user._id,
      product: product._id,
      quantity,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not place order.' });
  }
});

// Get current user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    // For each order, check if a review already exists
    const reviewedOrderIds = await Review.find({ user: req.user._id }).distinct('order');
    const reviewedSet = new Set(reviewedOrderIds.map((id) => id.toString()));

    const ordersWithReviewFlag = orders.map((o) => ({
      ...o.toObject(),
      hasReview: reviewedSet.has(o._id.toString()),
    }));

    res.json(ordersWithReviewFlag);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch orders.' });
  }
});

// Submit a review for an order
router.post('/:orderId/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id }).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const existing = await Review.findOne({ order: order._id });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this order.' });
    }

    const review = await Review.create({
      user: req.user._id,
      order: order._id,
      product: order.product._id,
      rating: Number(rating),
      comment,
      buyerName: req.user.name || req.user.email || 'Buyer',
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Could not submit review.' });
  }
});

// Get all reviews (public)
router.get('/reviews/all', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name brand')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch reviews.' });
  }
});

export default router;
