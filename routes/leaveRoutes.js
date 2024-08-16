import express from "express"
import { applyLeave, listAllLeaves } from "../controller/leaveController.js"
const leaveRouter = express.Router()

//apply leave

leaveRouter.post("/apply", applyLeave)
leaveRouter.get("/list/:userId", listAllLeaves)

export default leaveRouter
