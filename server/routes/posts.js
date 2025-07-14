const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const upload = require('../middleware/upload');

const router = express.Router();

// GET all posts with pagination
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
});

// GET posts with search and filter
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const category = req.query.category;

  const query = {
    title: { $regex: search, $options: 'i' }, // case-insensitive search
  };

  if (category) {
    query.category = category;
  }

  try {
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
});


// GET single post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST new post with optional image upload
router.post(
  '/',
  upload.single('image'), // multer middleware handles image
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });

      const saved = await newPost.save();
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/posts/:id/comments — Add a comment to a post
router.post('/:id/comments', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      author: req.body.author || 'Anonymous',
      text: req.body.text
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
