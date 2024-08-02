import mongoose, { mongo } from "mongoose"

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: Number,
  email: String,
  so: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  totalOrderAmount: {
    type: Number,
    default: 0,
  },
  totalOrderCount: {
    type: Number,
    default: 0,
  },
  totalPaymentAmount: {
    type: Number,
    default: 0,
  },
  totalPaymentCount: {
    type: Number,
    default: 0,
  },
})

const shopModel = mongoose.model("Shop", shopSchema)
export default shopModel
