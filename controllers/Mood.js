import Mood from "../models/Mood.js"

export const  getAllMoods = async(req, res) => {
    try {
     const moods = await Mood.find()
     res.send(moods)
    } catch (error) {
     res.status(500).json({message: "Server Error"})
    }
 }


 export const getMoodsByUser = async(req, res) => {
    try {
     const moods = await Mood.findMoodsByUser(req.user)
     res.send(moods)
    } catch (error) {
     res.status(500).json({message: "Server Error"})
    }
 }

 export const getMood = async(req, res) => {
    try {
        const {id} = req.params
        const foundMood = await Mood.findById(id)
        if(!foundMood) {
           return res.status(404).json({message: "Mood not found"})
        }
        res.send(foundMood)
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}

export const updateMood = async(req, res) => {
    try {
        const {id} = req.params
        const updated = await Mood.findByIdAndUpdate(id, req.body, {new: true})
        if(!updated) {
            return res.status(404).json({message: "Mood not found"})
        }
        res.send(updated)
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}
export const deleteMood = async(req, res) => {
    try {
        const {id} = req.params
        const deleted = await Mood.findByIdAndDelete(id)
        if(!deleted) {
            return res.status(404).json({message: "Mood not found"})
        }
        res.send({message: "Mood deleted", id: deleted.id})
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}
export const createMood = async (req, res) => {
    try {
        // const {user, mood, note} = req.body
        const newMood = new Mood(req.body)
        newMood.user = req.user
        await newMood.save()
        res.status(201).send(newMood)
    } catch (error) {
        res.status(500).json({message: "Server Error"})
    }
}
