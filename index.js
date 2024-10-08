import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"
import cloudinaryConnect from "./config/cloudinary.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
// Load environment variables from.env file
dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
//middleware
app.use(cors())
app.use(express.json())

//db connection
import connectDB from "./config/db.js"
connectDB()
cloudinaryConnect()
//routes for user
import userRouter from "./routes/userRoutes.js"
app.use("/api/users", userRouter)

app.get("/", (req, res) => {
  res.send("Hello, Express!")
})
//routes for shop

import shopRouter from "./routes/shopRoutes.js"
app.use("/api/shops", shopRouter)

//routes for order

import orderRouter from "./routes/orderRoutes.js"
app.use("/api/orders", orderRouter)

//routes for report

import reportRouter from "./routes/reportRoutes.js"
app.use("/api/reports", reportRouter)

//state head routes
import stateHeadRouter from "./routes/stateHeadRoutes.js"
app.use("/api/stateHead", stateHeadRouter)
//admin routes
import adminRouter from "./routes/adminRoutes.js"
app.use("/api/admin", adminRouter)

//attendance routes

import attendanceRouter from "./routes/attendanceRoutes.js"
app.use("/api/attendance", attendanceRouter)
//leave routes

import leaveRouter from "./routes/leaveRoutes.js"
app.use("/api/leave", leaveRouter)

//checking file upload with multer

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
