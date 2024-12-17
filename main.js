import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"


// Routes
import moodRoutes from "./routes/Mood.js"


dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/moods", moodRoutes)


const  PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))



