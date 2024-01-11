const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/comments/:postId", commentController.getAllComments);
router.post("/comments", commentController.createComment);
router.delete("/comments/:id", commentController.deleteComment);

module.exports = router;

