import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nafis.kamal.2000@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '7d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, location, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admin registration is not allowed.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'buyer',
      phone: phone || '',
      location: location || '',
      address: address || '',
    });
    const token = createToken({ id: user._id, role: 'buyer' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'buyer',
        phone: user.phone,
        location: user.location,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = createToken({ admin: true, role: 'admin', email: ADMIN_EMAIL });
      return res.json({ token, user: { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid login credentials.' });
    }

    const token = createToken({ id: user._id, role: user.role || 'buyer' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'buyer',
        phone: user.phone,
        location: user.location,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed.' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin profile updates are not supported here.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { name, phone, location, address } = req.body;
    user.name = name?.trim() || user.name;
    user.phone = phone ?? user.phone;
    user.location = location ?? user.location;
    user.address = address ?? user.address;
    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      address: user.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update profile.' });
  }
});

export default router;
