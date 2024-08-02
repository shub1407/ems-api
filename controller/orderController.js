import orderModel from "../models/orderModel.js"
import shopModel from "../models/shopModel.js"
// Create order
async function createOrder(req, res) {
  const { shopId } = req.params
  const { totalAmount, description, date, so } = req.body
  try {
    const newOrder = new orderModel({
      shopId,
      totalAmount,
      description,
      date,
      so,
    })
    const savedOrder = await newOrder.save()
    //adding orderId to ShopDatabase
    const shop = await shopModel.findByIdAndUpdate(
      shopId,
      {
        $push: { orders: savedOrder._id },
        $inc: { totalOrderAmount: totalAmount, totalOrderCount: 1 },
      },
      { new: true }
    )
    if (!shop) return res.status(404).json({ message: "Shop not found" })

    //send notification to shop owner about new order
    //...

    //send notification to customers about new order
    //...
    res.status(201).json({
      message: "Order created successfully",
      data: { savedOrder, shop },
      error: false,
    })
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, data: error.data, error: true })
  }
}
//add payment method

async function addPaymentToOrder(req, res) {
  const { orderId } = req.params
  const { paymentMethod, amount, description, date } = req.body
  try {
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        $push: { payments: { paymentMethod, amount, description, date } },
        $inc: { totalPayment: amount },
      },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: "Order not found" })
    //update shop total payment amount  and payment count
    let paymentAmount = parseInt(amount)
    const shop = await shopModel.findByIdAndUpdate(
      order.shopId,
      {
        $inc: { totalPaymentAmount: paymentAmount, totalPaymentCount: 1 },
      },
      { new: true }
    )
    if (!shop) return res.status(404).json({ message: "Shop not found" })
    res.json({
      message: "Payment added successfully",
      data: { order, shop },
      error: false,
    })
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, data: error.data, error: true })
  }
}

// Get all orders

async function getAllOrdersByShopId(req, res) {
  const shopId = req.params.shopId
  try {
    const orders = await orderModel.find({ shopId }).sort({ date: -1 })
    res.json({
      data: { orders },
      message: "Order fetched successfully",
      error: false,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get order by id

async function getOrderById(req, res) {
  const orderId = req.params.orderId
  try {
    const order = await orderModel.findById(orderId).populate("shopId")
    if (!order) return res.status(404).json({ message: "Order not found" })

    res.json({
      data: { order },
      message: "Order fetched successfully",
      error: false,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
export { createOrder, getAllOrdersByShopId, addPaymentToOrder, getOrderById }
