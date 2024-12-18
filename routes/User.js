import { Router } from "express";
import User from "../models/User.js";
import {
  allUsers,
  getProfile,
  toggleFollow,
  updateProfile,
  uploadProfile,
} from "../controllers/User.js";
import upload from "../config/multerConfig.js";

const router = Router();

router.get("/", allUsers);
router.get("/me", getProfile);
router.put("/update", updateProfile);
router.delete("/delete", updateProfile);
router.post("/:id/toggleFollow", toggleFollow);
router.post("/profile/picture", upload.single("profilePic"), uploadProfile);

export default router;
