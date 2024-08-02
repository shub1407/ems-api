import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["so", "state_head", "admin"],
  },
  state: {
    type: String,
  },
  city: [
    {
      type: String,
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
})

const userModel = mongoose.model("User", userSchema)
export default userModel
