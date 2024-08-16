import mongoose from "mongoose"
const shopVisitedSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming shopId refers to another model (e.g., Shop)
    ref: "Shop", // Reference to the Shop model (if applicable)
  },
  image: {
    type: String,
    // Assuming image is optional
  },
  remark: {
    type: String,
    // Assuming remark is optional
  },
  description: {
    type: String,
    // Assuming description is optional
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["present", "absent", "leave", "holiday"],
    default: "present",
  },
  punchIn: {
    type: Date,
  },
  punchOut: {
    type: Date,
  },
  role: {
    type: String,
    enum: ["so", "state_head", "admin"],
    required: true,
  },
  districtVisited: {
    type: String,
  },

  shopVisited: [shopVisitedSchema],
})

const attandanceModel = mongoose.model("Attendance", attendanceSchema)
export default attandanceModel
