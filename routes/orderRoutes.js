import express from "express"
const orderRouter = express.Router()

import {
  createOrder,
  getAllOrdersByShopId,
  addPaymentToOrder,
  getOrderById,
} from "../controller/orderController.js"

orderRouter.post("/:shopId/add", createOrder)

orderRouter.get("/:shopId", getAllOrdersByShopId)
orderRouter.post("/:orderId/add-payment", addPaymentToOrder)
//get order by id
orderRouter.get("/get-orders/:orderId", getOrderById)

export default orderRouter
