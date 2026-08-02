import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubscription);

router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);

router.route("/u/:subscriberId/subscriptions").get(getSubscribedChannels);

export default router;