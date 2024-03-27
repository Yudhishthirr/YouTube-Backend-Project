import { Router } from 'express';
import {addComment,updateComment,deleteComment} from '../controllers/comment.controller.js'
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/:videoId").get(getVideoComments)
router.route("/add-comment/:videoId").post(addComment)
router.route("/update-comment/:commentId").patch(updateComment)
router.route("/delete-comment/:commentId").get(deleteComment)
// .delete(deleteComment).patch(updateComment);

export default router