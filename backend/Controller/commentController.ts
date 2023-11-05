import { Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
const Comment = require ("../models/commentModel");

// Create Comment
export const createComment = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "POST")  return errorHandler(res, 500, "Only POST method is allowed");

        const {profileId} = req.params;
        const postId = req.query.postId;
        const {comment} = req.body;

        if(!postId || !profileId) return errorHandler(res, 404, "Id not Found");
        if(!comment) return errorHandler(res, 400, "Please also do the comment");

        const data = await new Comment({post_id: postId, profile_id: profileId, comment: comment});
        await data.save();

        res.status(201).json({
            success: true,
            data,
            message: "Comment Added Successfully"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Comment couldn't be added",
            error: error
        })
    }
});


// Get Comment By Post Id 
export const getCommentsByPostId = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const {postId} = req.params;
        if(!postId) return errorHandler(res, 400, "Post doesn't exist");
        
        const getPostById = await Comment.find({post_id: {$eq: postId}}).populate({
            path: "profile_id",
            select: "user_id name image"
        });

        res.status(200).json({
            success: true,
            getPostById
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Comment couldn't found",
            error: error
        })
    }
});


// Delete Comment
export const deleteComment = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "DELETE") return errorHandler(res, 500, "Only DELETE method is allowed");

        const {commentId} = req.body;
        if(!commentId) return errorHandler(res, 400, "Comment not found");

        const deletedComment = await Comment.findOneAndDelete({_id: commentId});
        if (!deletedComment) {
            return errorHandler(res, 404, "Comment not found");
        }

        res.status(200).json({
            success: true,
            message: "Comment deleted from the post"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Comment couldn't be deleted",
            error: error
        });
        console.warn(error);
    }
});