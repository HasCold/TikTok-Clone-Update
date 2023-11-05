import { Router } from "express";
import { protectRoutes } from "../middleware/authMiddleware";
import { createLike, useDeleteLike, useGetLikesByPostId } from "../Controller/likeController";

const router = Router();

router.post("/createLike/:profileId", protectRoutes, createLike);
router.get("/getLikesByPost", protectRoutes, useGetLikesByPostId);
router.delete("/deleteLike", protectRoutes, useDeleteLike);

module.exports= router;