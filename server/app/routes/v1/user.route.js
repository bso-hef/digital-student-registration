import express from "express";

import { profile } from "../../controllers/user.controller.js";
import { AUTHChecker } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", AUTHChecker, profile);

export default router;
