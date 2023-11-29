import {Router} from "express"
import { loginUser, registerUser, sendPasswordLink, validateUser } from "../Controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendpasswordLink", sendPasswordLink);
router.get("/validateUser", validateUser);

module.exports = router;