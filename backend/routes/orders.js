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
    if (quantity < (product.minQuantity || 1)) {
      return res.status(400).json({ message: `Minimum order quantity is ${product.minQuantity || 1}.` });
    }

    product.stock -= quantity;
    await product.save();

    const totalPrice = product.price * quantity;
    const order = await Order.create({
      user: req.user._id || req.user.id,
      product: product._id,
      quantity,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not place order.' });
  }
});

// Checkout multiple items from cart
router.post('/checkout', auth, async (req, res) => {
  try {
    const { items, phone, address } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Validate stock and MOQ for all items first
    const validatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: 'Product not found.' });
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
      }
      if (item.quantity < (product.minQuantity || 1)) {
        return res.status(400).json({ message: `Minimum order quantity for ${product.name} is ${product.minQuantity || 1}.` });
      }
      validatedItems.push({ product, quantity: item.quantity });
    }

    // Process stock deductions and create orders
    const createdOrders = [];
    for (const item of validatedItems) {
      item.product.stock -= item.quantity;
      await item.product.save();

      const order = await Order.create({
        user: req.user._id || req.user.id,
        product: item.product._id,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
      });
      createdOrders.push(order);
    }

    // Update user profile if phone/address provided
    if (phone || address) {
      import('../models/User.js').then(async ({ default: User }) => {
         const user = await User.findById(req.user._id || req.user.id);
         if (user && user.role !== 'admin') {
            if (phone) user.phone = phone;
            if (address) user.address = address;
            await user.save();
         }
      }).catch(e => console.error(e));
    }

    res.status(201).json({ message: 'Checkout successful', orders: createdOrders });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Could not process checkout.', error: error.message });
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

    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id || req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    
    if (order.status === 'pending' || order.status === 'rejected') {
      return res.status(403).json({ message: 'You can only review confirmed orders.' });
    }

    const existing = await Review.findOne({ order: order._id });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this order.' });
    }

    const review = await Review.create({
      user: req.user._id || req.user.id,
      order: order._id,
      product: order.product,
      rating: Number(rating),
      comment,
      buyerName: req.user.name || req.user.email || 'Buyer',
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Review Error:', error);
    res.status(500).json({ message: 'Could not submit review.', error: error.message });
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

// Admin: Get all orders
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('product', 'name brand')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch all orders.' });
  }
});

// Admin: Update order status
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    
    order.status = status;
    await order.save();
    res.json({ message: `Order status updated to ${status}.`, order });
  } catch (error) {
    res.status(500).json({ message: 'Could not update order status.' });
  }
});

export default router;
