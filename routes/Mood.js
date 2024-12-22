import express, { Router } from "express";
import { verify } from "../middlewares/Auth.js";

import {
  getAllMoods,
  getMoodsByUser,
  updateMood,
  deleteMood,
  getMood,
  getMoodFeeds,
  createMood,
  like,
} from "../controllers/Mood.js";

import { moodValidation } from "../middlewares/Validator.js";
import rateLimit from "express-rate-limit";

const router = Router();

const requestLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 60 requests per windowMs
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later.",
    });
  },
});

//GET: Fetching all Moods
router.get("/", requestLimit, getAllMoods);
router.get("/feeds", requestLimit, getMoodFeeds);
router.get("/my-moods", requestLimit, getMoodsByUser);

// GET, PUT, DELETE Mood
router.get("/:id", getMood);
router.put("/:id", updateMood);
router.delete("/:id", deleteMood);
router.post("/:id/like", like);

//POST: Adding a new Mood
router.post("/", moodValidation, createMood);

export default router;
