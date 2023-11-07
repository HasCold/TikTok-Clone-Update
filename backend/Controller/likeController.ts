import { Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
const Likes = require ("../models/likeModel");

// Create Like 
export const createLike = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "POST") return errorHandler(res, 500, "Only POST method is allowed");

        const {profileId} = req.params;
        const postId = req.query.postId;

        if(!profileId || !postId) return errorHandler(res, 400, "Profile or Post Id doesn't found");

        const likeData = await new Likes({profile_id: profileId, post_id: postId, likedUser: true});
        likeData.save();

        res.status(201).json({
            success: true,
            message: "Like added successfully",
            likeData
        });

    } catch (error) {
        console.warn(error);
        res.status(501).json({
            success: false,
            message: "Like couldn't be added",
            error: error
        });
    }
});


// Get likes By PostId 
export const useGetLikesByPostId = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");
    
        const postId = req.query.postId;
        if(!postId) return errorHandler(res, 400, "Post doesn't exist");

        const getLikesByPost = await Likes.find({post_id: postId});

        res.status(200).json({
            success: true,
            getLikesByPost
        });
    
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Likes doesn't found in required post"
        });
        console.warn(error);
    }
});


// Delete Like 
export const useDeleteLike = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "DELETE") return errorHandler(res, 500, "Only DELETE method is allowed");

        const {likeId} = req.query
        if(!likeId) return errorHandler(res, 400, "like id is found");

        await Likes.findByIdAndDelete({_id: likeId});
        res.status(200).json({
            success: true,
            message: "Unliked successfully"
        });

    } catch (error) {
        console.warn(error);
        res.status(500).json({
            success: false,
            message: "Like couldn't be deleted"
        });
    }
})