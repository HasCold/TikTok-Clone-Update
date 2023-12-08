import {Router} from "express";
import { protectRoutes } from '../middleware/authMiddleware';
import { SearchProfileByNames, createProfile, findRandomUsers, profileInfo, updateImageinProfileModel, useGetProfileByUserId, useUpdateProfile } from "../controller/profileController";

const router = Router();

router.post("/", createProfile);
router.get("/profileInfo", protectRoutes, profileInfo);
router.get("/profileUsers", protectRoutes, findRandomUsers);
router.get("/getProfileInfo", protectRoutes, useGetProfileByUserId);
router.put("/:id/updateProfile", protectRoutes, useUpdateProfile);
router.put("/:profileId/updateImage", protectRoutes, updateImageinProfileModel);
router.get("/searchNames", protectRoutes, SearchProfileByNames);

module.exports = router;