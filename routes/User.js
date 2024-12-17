import { Router } from "express"
import User from "../models/User.js"
import { getProfile, updateProfile } from "../controllers/User.js"

const router = Router()

router.get("/me", getProfile)
router.put("/update", updateProfile)
router.delete("/update", updateProfile)

export default router