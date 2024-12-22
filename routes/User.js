import { Router } from "express";

import {
  allUsers,
  getProfile,
  toggleFollow,
  updateProfile,
  uploadProfile,
  myProfile,
  deleteProfile,
} from "../controllers/User.js";

import upload from "../config/multerConfig.js";

const router = Router();

router.get("/", allUsers);

router.route("/me").get(myProfile).put(updateProfile).delete(deleteProfile);
router.post("/me/upload-profile", upload.single("profilePic"), uploadProfile);
router.get("/:id", getProfile);
router.post("/:id/follow", toggleFollow);

export default router;
