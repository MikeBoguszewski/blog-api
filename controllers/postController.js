const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { verifyToken, protectRoute } = require("../authMiddleware");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  // Get all posts
  const allPosts = await Post.find();
  res.send(allPosts);
});

exports.getPostById = asyncHandler(async (req, res, next) => {
  // Get post by id
  const post = await Post.findById(req.params.id);
  res.send(post);
});

exports.createPost = [
  verifyToken,
  protectRoute,
  // Validate and sanitize
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }).escape(),
  // Create post
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send errors
      res.status(400).send({ errors: errors.array() });
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        published: false,
      });
      // Save post
      await post.save();
      res.send(post);
    }
  }),
];

exports.updatePost = [
  verifyToken,
  protectRoute,
  // Validate and sanitize
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Send errors
      res.status(400).json({ errors: errors.array() });
    } else {
      // Create new post object
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        published: false,
        _id: req.params.id,
      });
      // Update post
      const newPost = await Post.findByIdAndUpdate(req.params.id, post, { new: true });
      res.send(newPost);
    }
  }),
];

exports.deletePost = [
  verifyToken,
  protectRoute,
  asyncHandler(async (req, res, next) => {
    // Delete post
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (deletedPost) {
      res.send(deletedPost);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  }),
];
