import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  so: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalAmount: Number,
  payments: [
    {
      paymentMethod: String,
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      screenShot: String,
      description: String,
    },
  ],
  totalPayment: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
})
const orderModel = mongoose.model("Order", orderSchema)
export default orderModel
