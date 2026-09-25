const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const sendSuccess = require('../utils/sendResponse');

// @route  GET /api/posts?search=&page=&limit=
// @access Public
const getAllPosts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const filter = {};
  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { content: { $regex: term, $options: 'i' } },
      { tags: { $regex: term, $options: 'i' } },
    ];
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  sendSuccess(res, 200, {
    posts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

// @route  GET /api/posts/:id
// @access Public
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  sendSuccess(res, 200, { post });
});

// @route  GET /api/posts/user/me
// @access Private
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
  sendSuccess(res, 200, { posts });
});

// @route  POST /api/posts
// @access Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, coverImage, tags } = req.body;

  const post = await Post.create({
    title,
    content,
    excerpt,
    coverImage,
    tags: Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.length
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    author: req.user._id,
  });

  const populated = await post.populate('author', 'name email');
  sendSuccess(res, 201, { post: populated }, 'Post created successfully');
});

// @route  PUT /api/posts/:id
// @access Private (author only)
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to edit this post');
  }

  const { title, content, excerpt, coverImage, tags } = req.body;
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (coverImage !== undefined) post.coverImage = coverImage;
  if (tags !== undefined) {
    post.tags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : post.tags;
  }

  await post.save();
  const populated = await post.populate('author', 'name email');
  sendSuccess(res, 200, { post: populated }, 'Post updated successfully');
});

// @route  DELETE /api/posts/:id
// @access Private (author only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this post');
  }

  await post.deleteOne();
  sendSuccess(res, 200, { id: req.params.id }, 'Post deleted successfully');
});

module.exports = {
  getAllPosts,
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
};
