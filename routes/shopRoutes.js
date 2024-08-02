import {
  addShop,
  getShopById,
  getShops,
  getShopBySo,
} from "../controller/shopController.js"
import express from "express"
const shopRouter = express.Router()
import { auth, isSo } from "../middleware/auth.js"
// Add a new shop

shopRouter.post("/add", auth, isSo, addShop)
shopRouter.get("/", auth, isSo, getShopBySo)
shopRouter.get("/:id", getShopById)

export default shopRouter
