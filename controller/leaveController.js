import leaveModel from "../models/leaveModel.js"
import userModel from "../models/userModel.js"
//apply-leave
export async function applyLeave(req, res) {
  const { userId, leaveType, startDate, endDate, reason } = req.body
  let approvedBy
  const user = await userModel.findById(userId)
  if (user.role === "so") {
    //find stateHead of a state
    const stateHead = await userModel.findOne({
      state: user.state,
      role: "state_head",
    })
    if (!stateHead) {
      return res
        .status(404)
        .json({ message: "No state head found", error: true })
    }
    approvedBy = stateHead._id
  } else if (user.role === "state_head") {
    const admin = await userModel.findOne({ role: "admin" })
    if (!admin) {
      return res.status(404).json({ message: "No admin found", error: true })
    }
    approvedBy = admin._id
  }
  const newLeave = new leaveModel({
    userId,
    leaveType,
    startDate,
    endDate,
    reason,
    approvedBy,
  })
  const leave = await newLeave.save()

  res.status(201).json({
    message: "Leave application submitted successfully",
    error: false,
    data: leave,
  })
}

//get all leave request

export async function listAllLeaves(req, res) {
  const leaves = await leaveModel
    .find({ userId: req.params.userId })
    .sort({ createdAt: -1 })
  res.json({
    message: "Leaves fetched successfully",
    error: false,
    data: leaves,
  })
}

//get all leave request assigned to a stateHead or admin

export async function listAllAssignedLeaves(req, res) {
  const leaves = await leaveModel
    .find({ approvedBy: req.params.userId })
    .sort({ createdAt: -1 })
    .populate("userId")
  res.json({
    message: "Leaves fetched successfully",
    error: false,
    data: leaves,
  })
}

//approved/reject particular assigned leaves

export async function approveOrRejectLeave(req, res) {
  const leaveId = req.params.leaveId
  const { status, message } = req.body
  const leave = await leaveModel
    .findByIdAndUpdate(
      leaveId,
      { status, message, isActive: false },
      { new: true }
    )
    .populate("userId")

  res.json({
    message: "Leave status updated successfully",
    error: false,
    data: leave,
  })
}
