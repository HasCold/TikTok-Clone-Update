import express, { Request, Response } from "express";
import { ImagesArray, UploadFileInfo } from '../types/backendTypes';
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
import path from "path";
const fs = require("fs");
const userImage = require("../models/userImageModel");

declare module 'express' {
    interface Request {
      file?: UploadFileInfo;
    }
  }

// This controller will save your file data in to the database
export const uploadFile = asyncErrorHandler(async (req: Request, res: Response) => { 
    try {
        // In our model we have saved the fileName, filePath, fileSize 

        if(req.method !== "POST") return errorHandler(res, 501, "Only POST method is allowed");

        // Request File :-  {
        //     fieldname: 'myFile',
        //     originalname: 'DCS image.jpg',
        //     encoding: '7bit',
        //     mimetype: 'image/jpeg',
        //     destination: './uploadedImage',
        //     filename: '1697466341323-DCS image.jpg',
        //     path: 'uploadedImage\\1697466341323-DCS image.jpg',
        //     size: 75944
        //   }
          
        req.body.userId = req.params.id;
        req.body.originalName = req.file?.originalname
        req.body.fileName = req.file?.filename;
        req.body.filePath = req.file?.path;
        req.body.fileSize = req.file?.size;

        if(!req.body.userId) return errorHandler(res, 401, "Your Id is missing")
        if(!req.body.fileName || !req.body.filePath || !req.body.fileSize || !req.body.originalName) return errorHandler(res, 500, "Some file information is missing");

    const imageData = await new userImage(req.body);
    await imageData.save();

    res.status(201).json({
        success: true,
        imageData
    })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        })
        console.error(error);
    }
});


// GET image 
export const retrieveImage = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        
        if(req.method !== 'GET') return errorHandler(res, 501, "Only GET method is allowed");

        const filename = req.params.filename;
        const imagePath = `/uploadedImage/${filename}`;

        if(!filename) return errorHandler(res, 404, "File name not found");

        res.sendFile(path.resolve(__dirname, "..", "uploadedImage", filename));

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
});


// Get Image filename by profileId
export const getImageFileNameByProfileId = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const {profileId} = req.params
        if(!profileId) return errorHandler(res, 403, "ID is missing");

        const imageData = await userImage.findOne({userId: profileId}).select("fileName");     

        res.status(201).json({
            success: true,
            imageData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Filename couldn't found or something error",
            error: error
        });
        console.error(error);
    }
})


//  Function to delete multiple files from both database and the file system
export const deleteImagesFromDBAndDirectory = asyncErrorHandler(async (req: Request, res: Response) => {
    // Delete from the database
    let imagesArray: ImagesArray[];
    try {
        const userId = req.query.userId;
        const {imageFileName} = req.body;

        if(!imageFileName) return errorHandler(res, 404, "File name cannot be found");
        if(!userId) return errorHandler(res, 404, "ID is missing");

        const getImage = await userImage.find(
            {userId: userId, fileName: {$ne: imageFileName}}
        );

        imagesArray = getImage;
        
    if(imagesArray.length > 0){
        for (let image of imagesArray) {
            try {
                await userImage.deleteOne({ userId: image.userId, fileName: image.fileName });
            } catch (dbError) {
                console.error(`Database deletion error for ${image.fileName}:`, dbError);
            }
            if (fs.existsSync(image.filePath)) {
                try {
                    fs.unlinkSync(image.filePath);  // Deleted from the file system or it means from your directory; 
                } catch (fsError) {
                    console.error(`File system deletion error for ${image.fileName}:`, fsError);
                }
            }
        }
    }
        res.status(204).json({
            success: true,
            message: "Images deleted successfully from database and file system"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Images couldn't deleted"
        });
        console.error(error);
    }

});