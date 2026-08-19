import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching blogs.' });
  }
});

// POST a new blog (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, summary } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ message: 'Title and summary are required.' });
    }
    const newBlog = new Blog({ title, summary });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating blog.' });
  }
});

// DELETE a blog (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    res.json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting blog.' });
  }
});

export default router;
