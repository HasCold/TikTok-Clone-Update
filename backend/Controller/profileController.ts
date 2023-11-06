import { Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from '../middleware/errorHandler';
import mongoose from "mongoose";
const profileModel = require ("../models/profileModel");

// Create Profile
export const createProfile = asyncErrorHandler(async (req: Request, res: Response) => {
    
    if(req.method !== "POST") return errorHandler(res, 401, "Only POST method is allowed");
    
    try {        
        const {name, image, _id} = req.body;

        if(!name || !_id) return errorHandler(res, 400, "Some information is missing");

        const profile = await profileModel.create({
           user_id: _id,
           name,
           image,
        })
        await profile.save();  // In MongoDB, the save() method is used to update a document in a collection or create a new document if it doesn't already exist. If the document has an _id field, save() updates the existing document; otherwise, it inserts a new one.
        res.status(201).json({
            success: true,
            message: "Profile Created Successfully",
            profile
        })
    } catch (error) {
        res.status(500).json(error);
        return errorHandler(res, 500);
    }
});


// Get Profile Info 
export const profileInfo = asyncErrorHandler( async (req: Request, res: Response) => {
    try {
        
        if(req.method !== "GET") return errorHandler(res, 400, "Only GET method is allowed");
        
        const userId = req.query.userId;   
        
        if(!userId) return errorHandler(res, 401, "ID is missing");
        
        const getProfile = await profileModel.findOne({user_id: {$eq: userId}});
        
        res.json({
            success: true,
            getProfile
        }) 
    }catch (error) {
        res.status(401).json({
            sucess: false,
            message: "ID doesn't match"
        })
     }
    }
);


// Find Random Users 
export const findRandomUsers = asyncErrorHandler( async (req: Request, res: Response) => {
    if(req.method !== "GET") return errorHandler(res, 400, "Only GET method is allowed");

    const randomUsers = await profileModel.find({}, {user_id: 1, name: 1, image: 1, _id: 1}).limit(5).sort({_id: -1});

    res.json({
        success: true,
        randomUsers
    });

    if(!randomUsers) return res.status(400).json({success: false, message: "You are not authorized"});
});


// Get Profile Info By User ID 
export const useGetProfileByUserId = asyncErrorHandler( async (req: Request, res: Response) => {
    try {
        
        if(req.method !== "GET") return errorHandler(res, 400, "Only GET method is allowed");
        
        const profileId = req.query.profileId;   
        
        if(!profileId) return errorHandler(res, 401, "ID is missing");
        
        const getProfile = await profileModel.findOne({_id: {$eq: profileId}}, {__v: 0});
        
        res.status(200).json({
            success: true,
            getProfile
        }) 
    }catch (error) {
        res.status(401).json({
            sucess: false,
            message: "ID doesn't match"
        })
     }
    }
);

// Use .save() if you want to work with the original document before the update.
// Use { new: true } if you want to work with the updated document after the update.

// Update Profile
export const useUpdateProfile = asyncErrorHandler( async (req: Request, res: Response) => {
    try {
        if(req.method !== "PUT") return errorHandler(res, 401, "Only PUT method is allowed");

        const id = req.params.id;
        const {name, bio} = req.body;

        if (!name || !bio) {
            return res.status(400).json({ success: false, message: "Something missing or incomplete data" });
        } if(!id) return errorHandler(res, 400, "ID is missing");

        const updateProfile = await profileModel.findByIdAndUpdate({_id: id}, {$set: {name, bio}}, {new: true})

        if(!updateProfile){
            res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            updateProfile,
            message: "Profile updated successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Profile couldn't updated!" 
        });
        console.error(error)
    }
});

// Update Image In Profile Model 
export const updateImageinProfileModel = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "PUT") return errorHandler(res, 500, "Only PUT method is allowed");
     
        const profileId = req.params.profileId;
        const {newImageURL} = req.body;

        if(!profileId || !newImageURL) return errorHandler(res, 404, "ID not found");

        const updatedProfileData = await profileModel.findByIdAndUpdate({_id: profileId}, {image: newImageURL}, {new: true})

        res.status(201).json({
            success: true,
            updatedProfileData,
            message: "Image updated successfully in profile model"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
});


// Search Profile by Names
export const SearchProfileByNames = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 500, "Only GET method is allowed");

        const SearchName = req.query.search as string;
        if (!SearchName) return errorHandler(res, 404, "No search name provided!");

        const getSearchNames = await profileModel.find({name: {$regex: `^${SearchName}`, $options: "i"}}, {name: 1, user_id: 1, image: 1}).limit(5)
        // The $regex operator is used to perform a regex search with the case-insensitive(Mean uppercase and lowercase letter treated be as same) option $options: 'i', and the caret ^ in the regex pattern ensures that the search starts with the given letters.

        res.status(201).json({
            success: true,
            getSearchNames
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Name couldn't found"
        });
    }
});
