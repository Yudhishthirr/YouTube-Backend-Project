import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import {createTweet,updateTweet,deleteTweet} from "../controllers/tweet.controller.js"
const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router.route("/createTweet").patch(upload.single("tweetfile"),createTweet)
router.route("/update-tweet/:tweetid").patch(updateTweet)
router.route("/delete-Tweet/:tweetid").get(deleteTweet)
// router.route("/user/:userId").get(getUserTweets);
// router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router