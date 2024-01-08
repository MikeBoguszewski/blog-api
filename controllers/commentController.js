const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { verifyToken, protectRoute } = require("../authMiddleware");

exports.getAllComments = asyncHandler(async (req, res, next) => {
  // Get all comments
  const allComments = await Comment.find({post: req.params.id});
  res.send(allComments);
});

exports.createComment = [
  // Validate and sanitize
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Send errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const comment = new Comment({
        content: req.body.content,
        post: req.params.postId,
      });
      // Save comment
      await comment.save();
      res.send(comment);
    }
  }),
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
  // Delete comment
  const deletedComment = await Comment.findByIdAndDelete(req.params.id);
  if (deletedComment) {
    res.send(deletedComment);
  } else {
    res.status(404).send({ message: "Comment not found" });
  }
});
