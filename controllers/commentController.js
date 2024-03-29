const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

exports.getAllComments = asyncHandler(async (req, res, next) => {
  // Get all comments
  const allComments = await Comment.find({ post: new ObjectId(req.params.postId) });
  res.send(allComments);
});

exports.createComment = [
  // Validate and sanitize
  body("content", "Content cannot be empty").trim().isLength({ min: 1 }).escape(),
  body("postId", "PostId cannot be empty").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Send errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      const comment = new Comment({
        content: req.body.content,
        post: new ObjectId(req.body.postId),
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
