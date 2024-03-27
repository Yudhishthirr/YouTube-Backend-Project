import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllvideo,publishAVideo,getVideoById,updateVideo,updateThumnail,deleteVideo } from "../controllers/video.controller.js";
const router = Router()

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllvideo)


router.route("/upload-videos").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }, 
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
    )
router.route("/:videoId").get(getVideoById)
// router.route("/:videoId").get(getAllvideo)
router.route("/update-video/:videoId/:title/:description").get(updateVideo)
router.route("/delete-video/:videoId").get(deleteVideo)
router.route("/update-thumbnail/:videoId").patch(upload.single("thumbnail"),updateThumnail)

export default router