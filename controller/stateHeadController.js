import userModel from "../models/userModel.js"
import shopModel from "../models/shopModel.js"
async function listSo(req, res) {
  const state = req.params.state
  const soList = await userModel.find({ state: state, role: "so" })
  if (!soList) {
    return res
      .status(404)
      .json({ message: "No SO found in this state", error: true })
  }
  res.json({
    data: soList,
    message: "SO list fetched successfully",
    error: false,
  })
}
async function listShopsOfSo(req, res) {
  const soId = req.query.so
  const so = await userModel.findById(soId)
  const soShops = await shopModel.find({ so: soId })
  if (!soShops) {
    return res
      .status(404)
      .json({ message: "No shops found for this SO", error: true })
  }
  res.json({
    data: { shops: soShops, so },
    message: "Shops list fetched successfully",
    error: false,
  })
}

export { listSo, listShopsOfSo }
