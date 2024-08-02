import shopModel from "../models/shopModel.js"

async function addShop(req, res) {
  const so = req.user.userId
  const { name, city, state, address, email, phone } = req.body
  try {
    const shop = new shopModel({ name, city, address, so, phone, email, state })
    const savedShop = await shop.save()
    res.status(201).json({
      message: "Shop added successfully",
      error: false,
      data: { savedShop },
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to add shop",
      error: true,
      data: error,
    })
  }
}

async function getShops(req, res) {
  try {
    const shops = await shopModel.find({})
    res.status(200).json({
      message: "Shops fetched successfully",
      error: false,
      data: { shops },
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch shops",
      error: true,
      data: error,
    })
  }
}

async function getShopBySo(req, res) {
  const so = req.user.userId
  console.log(so)
  try {
    const shop = await shopModel.find({ so })
    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
        error: true,
      })
    }
    res.status(200).json({
      message: "Shop fetched successfully",
      error: false,
      data: { shop },
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch shop",
      error: true,
      data: error,
    })
  }
}

async function getShopById(req, res) {
  try {
    const shop = await shopModel.findById(req.params.id).populate("orders")
    if (!shop) {
      return res.status(404).json({
        message: "Shop not found",
        error: true,
      })
    }

    res.status(200).json({
      message: "Shop fetched successfully",
      error: false,
      data: { shop },
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch shop",
      error: true,
      data: error,
    })
  }
}

export { addShop, getShops, getShopById, getShopBySo }
