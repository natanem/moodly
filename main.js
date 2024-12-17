import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js"



// Routes
import moodRoutes from "./routes/Mood.js"
import authRoutes from "./routes/Auth.js"
import userRoutes from "./routes/User.js"

// Middlewares
import { verify } from "./middlewares/Auth.js"
import errorHandler from "./middlewares/ErrorHandler.js"


dotenv.config()
connectDB()

const app = express()
app.use(helmet())
app.use(express.json())
app.use(cors())

app.use("/api/moods", verify, moodRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users",verify, userRoutes)


app.use(errorHandler)


const  PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))



