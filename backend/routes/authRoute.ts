import {Router} from "express"
import { loginUser, registerUser, resetPassword, sendPasswordLink, validateUser } from "../Controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendpasswordLink", sendPasswordLink);
router.get("/forgotPassword/:id/:token", validateUser);
router.put("/resetPassword/:id/:token", resetPassword);

module.exports = router;