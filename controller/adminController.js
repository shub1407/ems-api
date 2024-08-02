import userModel from "../models/userModel.js"

async function listStateHead(req, res) {
  // get all state heads from the database

  const users = await userModel.find({ role: "state_head" })
  if (!users) {
    return res.status(404).json({ message: "No users found", error: true })
  }
  res.json({ data: users, message: "State heads found", error: false })
}
export { listStateHead }
