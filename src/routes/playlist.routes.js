import { Router } from 'express';
import {createPlaylist,addVideoToPlaylist,removeVideoToPlaylist,deletePlaylist} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = Router();
router.use(verifyJWT);

router.route("/").post(createPlaylist)
router.route("/add/:videoId/:playlistId").get(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").get(removeVideoToPlaylist);
router.route("/delete/:playlistId").get(deletePlaylist);

export default router