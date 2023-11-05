// multer is a middleware

import multer from "multer";
import fs from "fs";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        const directory = "./uploadedImage";

        // checks whether the file directory is uploaded or not via using file system 
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory);             
        }  

        cb(null, directory);
    },
    filename: (req: Request, file: any, cb: any) => {
        // file{   fieldname: 'myFile',
            //     originalname: 'DCS image.jpg',
            //     encoding: '7bit',
            //     mimetype: 'image/jpeg'}
        const allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg']
        const isValidImage = allowedMimeType.includes(file.mimetype)

        if(isValidImage ){
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName); 
        }else{
            return console.error("Invalid file type. Only .png, .jpg, and .jpeg files are allowed.");  

        }
            
    }
});

module.exports = multer({storage});
