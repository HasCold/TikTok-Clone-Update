import { Router } from "express";
import { protectRoutes } from "../middleware/authMiddleware";
import { deleteImagesFromDBAndDirectory, retrieveImage, uploadFile } from "../Controller/userImageController";
const uploadMiddleware = require("../middleware/uploadImageMiddleware");

const router = Router();

router.post("/:id/imageUpload", protectRoutes, uploadMiddleware.single("myFile"), uploadFile);
router.get("/images/:filename", protectRoutes, retrieveImage);
router.delete("/images/allDeleted", protectRoutes, deleteImagesFromDBAndDirectory);

module.exports= router;