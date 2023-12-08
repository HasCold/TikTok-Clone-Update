import { Router } from "express";
import { protectRoutes } from "../middleware/authMiddleware";
import { getAllPosts, getPostById, getVideosByProfileId, uploadVideo, useDeletePostById } from '../controller/postController';
const uploadMiddleware = require('../middleware/uploadVideoMiddleware');

const router = Router();

router.post("/:profileId/videoUpload", protectRoutes,  uploadMiddleware.single("video"), uploadVideo);
router.get("/:profileId/getVideos", protectRoutes, getVideosByProfileId);
router.get("/getPostById", protectRoutes, getPostById);
router.get("/getAllPosts", getAllPosts);
router.delete("/deletePostById", protectRoutes, useDeletePostById);

module.exports = router;