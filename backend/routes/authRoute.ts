import {Router} from "express"
import { loginUser, registerUser, sendPasswordLink } from "../Controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendpasswordLink", sendPasswordLink);

module.exports = router;