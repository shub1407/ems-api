import express from "express"
const adminRouter = express.Router()

import { listStateHead } from "../controller/adminController.js"
adminRouter.get("/list-statehead", listStateHead)
export default adminRouter
