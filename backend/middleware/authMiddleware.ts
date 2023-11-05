const jwt = require("jsonwebtoken");
const UserModel = require("../models/authModel");
import { asyncErrorHandler } from "./errorHandler";
import { NextFunction, Request, Response } from "express";
import { userTypes } from "../types/backendTypes";

declare global{
    namespace Express{
        interface Request{
            user: userTypes;
        }
    }
}

export const protectRoutes = asyncErrorHandler( async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // console.log("Header",authHeader);

    if(authHeader && authHeader.startsWith("Bearer")){
        try {
            const token = authHeader.split(" ")[1];  //token split into array like so we are accessing our token on 1 index ["Bearer", "abjdbadbabasbdad"]
            
            const decodedId = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // req.user = await UserModel.findById(decodedId).select("-password, -confirmPassword");

            req.user = await UserModel.findById(decodedId.id, {password: 0, confirmPassword: 0}).exec();  // uses a projection object to specify which fields to exclude from the query result. By setting password: 0 and confirmPassword: 0
            next(); // When next() is called, it triggers the execution of the next middleware function in the stack. If there are no more middleware functions to execute, it indicates that the request-response cycle is complete, and Express sends the response back to the client.
        }catch{
            res.status(403).json({
                error: "Token verification failed" 
            });
        }
    }else{
        res.status(401).json("You Are Not Authorized !!!");
        throw new Error("Not Authorized !!!");
    }
});
