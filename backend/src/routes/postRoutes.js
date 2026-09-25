const express = require('express');
const { body } = require('express-validator');
const {
  getAllPosts,
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

// Public routes
router.get('/', getAllPosts);

// NOTE: this must be declared before '/:id' or Express would treat
// "user" as an :id value.
router.get('/user/me', protect, getMyPosts);

router.get('/:id', getPost);

// Private routes
router.post('/', protect, postValidation, validate, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
