import { Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
import { DeletePostType, UploadFileInfo} from "../types/backendTypes";
import path from "path";
import fs from 'fs';
const post = require ("../models/postModel");

declare module 'express'{
    interface Request {
        file?: UploadFileInfo
    }
}

// Upload Video
export const uploadVideo = asyncErrorHandler(async (req: Request, res: Response) => {
    try {

        if(req.method !== "POST") return errorHandler(res, 501, "Only POST method is allowed");
        
        // Request.File :-
        // fieldname: 'video',
        // originalname: 'video (2160p).mp4',
        // encoding: '7bit',
        // mimetype: 'video/mp4',
        // destination: './uploadedVideos',
        // filename: '1697965145163-video (2160p).mp4',
        // path: 'uploadedVideos\\1697965145163-video (2160p).mp4',
        // size: 70137101
          
        req.body.profile_id = req.params.profileId;
        req.body.originalName = req.file?.originalname
        req.body.fileName = req.file?.filename;
        req.body.filePath = req.file?.path;
        req.body.fileSize = req.file?.size;
        req.body.text = req.body.Caption;

        if(!req.body.profile_id) return errorHandler(res, 401, "Your Id is missing")
        if(!req.body.fileName || !req.body.filePath || !req.body.fileSize || !req.body.originalName) return errorHandler(res, 500, "Some file information is missing");
        if(!req.body.text) return errorHandler(res, 401, "Caption is also required along with the video");

        const videoUpload = await new post(req.body);

        await videoUpload.save();
        res.status(201).json({
            success: true,
            videoUpload,
            message: "Video successfully uploaded"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Video couldn't be uploaded"
        })
    }
});


// Get All Videos
export const getVideosByProfileId = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const profileId = req.params.profileId;
        
        
        if(!profileId) return errorHandler(res, 500, "Profile ID is missing");
        const data = await post.find({profile_id: profileId}, {_id: 1, fileName: 1, originalName: 1, text: 1, profile_id: 1, createdAt: 1}).sort({_id: -1});
        // const data = await post.find({profile_id: profileId}).populate({
        //     path: 'profile_id',
        //     select: 'name bio image'
        // })
        if(!data) return errorHandler(res, 404, "POST Not Found");

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not Found'
        })
    }
});


// GET Post By Id
export const getPostById = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const postId = req.query.postId;

        const singlePost = await post.findOne({_id: postId}, {_id: 1, fileName: 1, originalName: 1, text: 1, profile_id: 1, createdAt: 1}).populate({
            path: "profile_id",
            select: "user_id name image"
        })
        if(!singlePost) return errorHandler(res, 404, "Post Not Found");

        res.status(201).json({
            sucess: true,
            singlePost
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'ID Not Found'
        })
    }
});


// GET All Post 
export const getAllPosts = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const multiplePosts = await post.find({}, {_id: 1, fileName: 1, originalName: 1, text: 1, profile_id: 1, createdAt: 1}).sort({_id: -1}).populate({
            path: "profile_id",
            select: "user_id name image"
        });

        if(!multiplePosts) return errorHandler(res, 404, "Posts Not Found");

        res.status(201).json({
            sucess: true,
            multiplePosts
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Internal Server Error'
        })
    }   
});


// Delete Post BY ID
export const useDeletePostById = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "DELETE") return errorHandler(res, 500, "Only Delete method is allowed");

        const postId = req.query.postId;
        const {fileName} = req.body;

        if(!postId) return errorHandler(res, 400, "Id is missing");
        if(!fileName) return errorHandler(res, 400, "Please also send the file");

        const getPostForDelete: DeletePostType = await post.findOne({
            _id: postId,
            fileName: fileName
        }, {filePath: 1, profile_id: 1, _id: 0});

        if(getPostForDelete){
        await post.deleteOne({_id: postId, fileName: fileName});

            if(fs.existsSync(getPostForDelete.filePath)){
                try {
                    fs.unlinkSync(getPostForDelete.filePath);
                } catch (fsError) {
                    console.error(`File system deletion error for ${fileName}:`, fsError)
                }
            }
               
            res.status(200).json({
                success: true,
                message: `Post deleted successfully`, 
            })
        }else{
            res.status(404).json({
                success: false,
                message: "Post not found for deletion"
            });
        }

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Post couldn't deleted",
            error: error
        })
    }
});