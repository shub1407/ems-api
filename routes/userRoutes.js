import {
  signup,
  login,
  authStatus,
  changePassword,
  updateProfile,
} from "../controller/UserController.js"
import { auth } from "../middleware/auth.js"
import express from "express"

const userRouter = express.Router()

// POST /api/users/signup

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.get("/auth-status", auth, authStatus)
userRouter.post("/change-password", changePassword)
userRouter.post("/update-profile", updateProfile)

export default userRouter
