import leaveModel from "../models/leaveModel.js"
//apply-leave
export async function applyLeave(req, res) {
  const { userId, leaveType, startDate, endDate, reason } = req.body
  const newLeave = new leaveModel({
    userId,
    leaveType,
    startDate,
    endDate,
    reason,
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
    .sort({ startDate: -1 })
  res.json({
    message: "Leaves fetched successfully",
    error: false,
    data: leaves,
  })
}
