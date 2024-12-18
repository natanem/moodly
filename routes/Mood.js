import express, { Router } from "express";
import Mood from "../models/Mood.js";
import {
  getAllMoods,
  getMoodsByUser,
  updateMood,
  deleteMood,
  getMood,
  getMoodFeeds,
  createMood,
  toggleLike,
} from "../controllers/Mood.js";
import { moodValidation, validate } from "../middlewares/Validator.js";

const router = Router();

//GET: Fetching all Moods
router.get("/", getAllMoods);
router.get("/feeds", getMoodFeeds);
router.get("/my-moods", getMoodsByUser);

// GET, PUT, DELETE Mood
router.get("/:id", getMood);
router.put("/:id", updateMood);
router.delete("/:id", deleteMood);
router.delete("/:id/like", toggleLike);

//POST: Adding a new Mood
router.post("/", moodValidation, validate, createMood);

export default router;
