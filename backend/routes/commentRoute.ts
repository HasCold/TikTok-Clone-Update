import { Router } from "express";
import { protectRoutes } from "../middleware/authMiddleware";
import { createComment, deleteComment, getCommentsByPostId } from "../controller/commentController";

const router = Router();

router.post("/createComment/:profileId", protectRoutes, createComment);
router.get("/getComment/:postId", protectRoutes, getCommentsByPostId);
router.delete("/deleteComment", protectRoutes, deleteComment);

module.exports = router;