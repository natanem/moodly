import { Router } from "express";
import rateLimit from "express-rate-limit";

import User from "../models/User.js";
import { login, register } from "../controllers/Auth.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,  // Limit each IP to 5 requests per `windowMs`
  message: "Too many login attempts, please try again later"
});


router.post("/register", register );

router.post("/login", authLimiter, login);

export default router;
