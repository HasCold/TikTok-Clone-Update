import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
const UserModel = require ("../models/authModel");
const generateToken = require("../config/generateToken");
const CryptoJS = require ("crypto-js");

export const registerUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    // For hashing the password we are using the crypto-js and currently using the cipher (AES)

    if(req.method !== "POST")
    return errorHandler(res, 400, "Only POST method is allowed");

    const {name, email, password, confirmPassword} = req.body;

    if(!name || !email || !password || !confirmPassword)
    return errorHandler(res, 400, "Please enter all the fields")

    if(password !== confirmPassword)
    return errorHandler(res, 400, "Password and confirm password does not matched !")

    let newUser = await UserModel.findOne({email});
    if(newUser) return errorHandler(res, 400, "User already registered !");

    newUser = await new UserModel({
        name,
        email,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(), 
        confirmPassword: CryptoJS.AES.encrypt(confirmPassword, process.env.PASS_SEC).toString() 
        // The .toString() method is added to the CryptoJS.AES.encrypt() calls to ensure that the encrypted passwords are converted to strings, which is expected by the Mongoose model. 
    });

    // Below is another method to save the token on client side(browser) though we don't need to use authMiddelware 
    // if(token){
    //     cookieSetter(res, token, true);
    // }else{cookieSetter(res, token, false)}

    // save to mongo database; we can use the save() function to update the changes back to the database
    try {
        const savedUser = await newUser.save();
        res.status(201).json({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        image: newUser.image,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
        token: generateToken(savedUser._id),
        success: true,
        message: "Register Successfully"
    });

    } catch (error: any) {
        res.status(500).json(error);
    }
});

export const loginUser = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    try{
    if(req.method !== "POST") 
    return errorHandler(res, 400, "Only POST method is allowed !");
    
    const {email, password} = req.body;

    if(!email || !password) 
    return errorHandler(res, 400, "Please enter all the fields");

    const user = await UserModel.findOne({email}).select("+password");  //     // When you query for a user document, you can explicitly include the password field in the query results by passing the select option with the value true in the query. For example, you can include the password field in the query results like this.
    if(!user)
    return errorHandler(res, 400, "Invalid email or password");

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    // convert hashed password into string
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
    // Below is another method to save the token on client side(browser) though we don't need to use authMiddelware 
    // if(token){
    //     cookieSetter(res, token, true);
    // }else{cookieSetter(res, token, false)}


        if(user && (user.matchPassword(password, originalPassword))){
            const {password, confirmPassword, ...others} = user._doc;
            res.status(201).json({
                ...others,
                token: generateToken(user._id),
                success: true,
                message: "Login Successfully"
            })   
        }
    }catch{
        res.status(401);
        throw new Error("Invalid Credentials !");      
    }
});