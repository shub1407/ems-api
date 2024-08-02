import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
async function signup(req, res) {
  try {
    let { name, email, phone, password, role, state, city } = req.body
    //check if user is already logged in
    const existedUser = await userModel.findOne({ email })
    if (existedUser) {
      return res
        .status(409)
        .json({ message: "User already exists", error: true, existedUser })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    if (role === "admin") state = "admin"
    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      state,
      city,
    })
    const user = await newUser.save()
    res.status(201).json({
      message: "User created successfully",
      error: false,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", error: true })
    }
    //generate JWT token
    const payload = {
      email,
      role: user.role,
      userId: user.id,
      city: user.city,
      state: user.state,
    }
    const token = jwt.sign(payload, process.env.JWT_KEY)
    res.json({
      message: "Logged in successfully",
      error: false,
      data: { token, userId: user._id, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
async function changePassword(req, res) {
  try {
    const { userId, password, oPassword } = req.body
    let user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true })
    }
    const isMatch = await bcrypt.compare(oPassword, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Old password is incorrect", error: true })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user = await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    )

    res.json({
      message: "Password changed successfully",
      error: false,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
async function updateProfile(req, res) {
  try {
    const { userId, name, email, phone } = req.body
    let user = await userModel.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true })
    }
    res.json({
      message: "Profile updated successfully",
      error: false,
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
async function authStatus(req, res) {
  try {
    const { userId, role, city, state } = req.user
    const response = await userModel.findById(userId, { password: 0 })

    res.json({
      message: "Authentication successful",
      error: false,
      data: { userId, role, city, state, userDetail: response },
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
export { signup, login, authStatus, changePassword, updateProfile }
