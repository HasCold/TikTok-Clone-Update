import multer from "multer";
import fs from "fs";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        const directory = "./uploadedVideos"; // Change the destination directory for videos

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }

        cb(null, directory);
    },
    filename: (req: Request, file: any, cb: any) => {
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/mkv', 'video/avi']; // Adjust the allowed video mime types
        // File :- {
        //     fieldname: 'video',
        //     originalname: 'video (2160p).mp4',
        //     encoding: '7bit',
        //     mimetype: 'video/mp4'
        //   }
        if (allowedMimeTypes.includes(file.mimetype)) {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        } else {
            return console.error("Invalid file type. Only .mp4, .webm, .mkv, .avi videos are allowed.");
        }
    }
});

module.exports = multer({ storage });
