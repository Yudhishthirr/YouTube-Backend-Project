import { Router } from 'express';
import {toggleSubscription} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/subscribe/:channelId").get(toggleSubscription)


export default router