import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, errorHandler } from "../middleware/errorHandler";
import { Error } from "mongoose";
const UserModel = require ("../models/authModel");
const generateToken = require("../config/generateToken");
const CryptoJS = require ("crypto-js");
const resetPasswordToken = require('../config/generateToken')
const transporter = require("../utils/emailFeature")
const jwt = require ("jsonwebtoken");

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


// Send link to email for reset password
export const sendPasswordLink = asyncErrorHandler(async (req: Request, res: Response) => {
    try {
        if(req.method !== "POST") return errorHandler(res, 400, "Only POST method is allowed !");

        const {email} = req.body;
        if(!email) return errorHandler(res, 400, "Enter email address")

        const userEmail = await UserModel.findOne({email: email});
        if(!userEmail) return errorHandler(res, 404, "This user doesn't exist");

        const token = resetPasswordToken(userEmail._id, "120s");

        const setUserToken = await UserModel.findByIdAndUpdate({_id: userEmail._id}, {resetToken: token},{new: true}).select("-confirmPassword");

        if(setUserToken){
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: email,
                subject: "Sending email for reset password",
                text: `This Link is Valid Only For 2 Minutes ${process.env.CLIENT_PORT}/resetpassword/${userEmail._id}/${setUserToken.resetToken}`
            }

            transporter.sendMail(mailOptions, (error: Error, info: any) => {
                if(error){
                    console.log("error", error);
                    res.status(401).json({
                        success: false,
                        message: "Email not send"
                    })
                }else{
                    console.log("Email sent", info.response);
                    res.status(201).json({
                        success: true,
                        message: "Email sent successfully!"
                    })
                }
            })
        }


    } catch (error) {
        res.status(501).json({
            success: false,
           message: "Password Link couldn't send",
           error: error
        })
    }
});


// Validate User to proceed them for resetPassword process 
export const validateUser = asyncErrorHandler( async (req: Request, res: Response) => {
    try {
        if(req.method !== "GET") return errorHandler(res, 400, "Only GET method is allowed !");
        const {id, token} = req.params;
        
        const validUser = await UserModel.findOne({_id: id, resetToken: token}, {confirmPassword: 0, _id: 0});

        const verifyToken = jwt.verify(validUser.resetToken, process.env.JWT_SECRET_KEY);

        if(validUser && verifyToken.id){
            res.status(201).json({
                status: 201,
                success: true,
                validUser
            })
        }else{
            res.status(401).json({
                success: false,
                message: "User not exist"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(501).json({
            success: false,
            message: "User is not valid for reseting the password"
        })
    }
});


// Change the Password
export const resetPassword = asyncErrorHandler( async (req: Request, res: Response) => {
    try {
        if(req.method !== "PUT") return errorHandler(res, 400, "Only PUT method is allowed !");

        const {id, token} = req.params;
        const {password} = req.body;
        if(!id || !token || !password) return errorHandler(res, 404, "Something is missing");

        const validUser = await UserModel.findOne({_id: id, resetToken: token}, {confirmPassword: 0, _id: 0});
        const verifyToken = jwt.verify(validUser.resetToken, process.env.JWT_SECRET_KEY);

        if(validUser && verifyToken.id){
            const user = await UserModel.findOne({_id: {$eq: id}, resetToken: token}).select("+password");
            const decryptHashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC); 
            const originalPassword = decryptHashedPassword.toString(CryptoJS.enc.Utf8);

            if(password === originalPassword) return errorHandler(res, 422, "New Password must be different from the previous one");

            const newHashedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
            const updatePasswordField = await UserModel.findByIdAndUpdate({_id: id}, {$set: {password: newHashedPassword, confirmPassword: newHashedPassword}}, {new: true}).select("+password");

            if(updatePasswordField){
                await UserModel.findByIdAndUpdate({_id: id}, {$unset: {resetToken: 1}}, {new: true});
            }

            res.status(201).json({
                success: true,
                message: "Password Updated Successfully !",
            });

        }else{
            res.status(401).json({
                success: false,
                message: "User not exist"
            });
        }

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Password couldn't updated !",
            error: error
        })      
    }
});