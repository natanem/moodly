import express, {Router} from "express"
import Mood from "../models/Mood.js"

const router = Router()

//GET: Fetching all Moods
router.get("/", async(req, res) => {
   try {
    const moods = await Mood.find()
    res.send(moods)
   } catch (error) {
    res.status(500).json({message: "Server Error"})
   }
})
//POST: Adding a new Mood
router.post("/", async (req, res) => {
    try {
        // const {user, mood, note} = req.body
        const newMood = new Mood(req.body)
        await newMood.save()
        res.status(201).send(newMood)
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
})

export default router