import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(upload.fields([
    {
      name: "avatar",
      maxCount:1
    },
    {
      name: "coverImage",
      maxCount:1
    }
]), registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").get(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/-history").get(verifyJWT, getUserWatchHistory)
// router.route("/channel").post(getUserChannelProfile)
 



export default router