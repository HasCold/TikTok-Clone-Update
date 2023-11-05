import {Router} from "express"
import { loginUser, registerUser } from "../Controller/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;