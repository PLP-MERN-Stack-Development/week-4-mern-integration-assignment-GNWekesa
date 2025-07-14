const mongoose = require('mongoose');

// Comment subdocument schema
const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  comments: [commentSchema], // ✅ add comments array
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
