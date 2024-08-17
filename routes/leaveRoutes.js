import express from "express"
import {
  applyLeave,
  listAllLeaves,
  listAllAssignedLeaves,
  approveOrRejectLeave,
} from "../controller/leaveController.js"
const leaveRouter = express.Router()

//apply leave

leaveRouter.post("/apply", applyLeave)
leaveRouter.get("/list/:userId", listAllLeaves)
leaveRouter.get("/assigned/list/:userId", listAllAssignedLeaves)
leaveRouter.post("/approve/:leaveId", approveOrRejectLeave)

export default leaveRouter
