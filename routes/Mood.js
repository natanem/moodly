import express, {Router} from "express"
import Mood from "../models/Mood.js"
import { getAllMoods, getMoodsByUser, updateMood, deleteMood, getMood, createMood } from "../controllers/Mood.js"

const router = Router()

//GET: Fetching all Moods
router.get("/", getAllMoods)
router.get("/my-moods", getMoodsByUser)

// GET, PUT, DELETE Mood
router.get("/:id", getMood)
router.put("/:id", updateMood)
router.delete("/:id", deleteMood)

//POST: Adding a new Mood
router.post("/", createMood)

export default router