//report services for so
import orderModel from "../models/orderModel.js"
import shopModel from "../models/shopModel.js"
import userModel from "../models/userModel.js"

async function generateReportForSo(req, res) {
  const soId = req.params.soId
  //so-info
  const soInfo = await userModel.findById(soId).select("-password")
  if (!soInfo) {
    return res.status(404).json({
      message: "SO not found",
      error: true,
      data: "[]",
    })
  }

  //order report
  const ordersOfSo = await orderModel.find({ so: soId }).populate("shopId")
  if (!ordersOfSo) {
    return res.status(404).json({
      message: "No orders found for this SO",
      error: "false",
      data: "[]",
    })
  }
  const totalOrders = ordersOfSo.length
  const totalAmount = ordersOfSo.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  )
  const totalPayment = ordersOfSo.reduce(
    (acc, order) => acc + order.totalPayment,
    0
  )
  //district wise
  const ordersByDistrict = {}
  ordersOfSo.forEach((order) => {
    if (ordersByDistrict[order.shopId.city]) {
      ordersByDistrict[order.shopId.city].totalAmount += order.totalAmount
      ordersByDistrict[order.shopId.city].totalPayment += order.totalPayment
      ordersByDistrict[order.shopId.city].ordersCount += 1
    } else {
      ordersByDistrict[order.shopId.city] = {
        totalAmount: order.totalAmount,
        totalPayment: order.totalPayment,
        ordersCount: 1,
      }
    }
  })

  //shop report
  const shopsOfSo = await shopModel.find({ so: soId }).populate("so")
  if (!shopsOfSo) {
    return res.status(404).json({
      message: "No shops found for this SO",
      error: "false",
      data: "[]",
    })
  }
  const totalShops = shopsOfSo.length
  //shopsByDistrict
  const shopsByDistrict = {}
  shopsOfSo.forEach((shop) => {
    if (shopsByDistrict[shop.city]) {
      shopsByDistrict[shop.city].totalShops += 1
    } else {
      shopsByDistrict[shop.city] = {
        totalShops: 1,
      }
    }
  })

  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      orders: {
        totalOrders,
        totalAmount,
        totalPayment: totalPayment,
        ordersByDistrict,
      },

      shops: {
        totalShops,
        shopsByDistrict,
      },
      so: soInfo,
    },
  })
}

async function generateReportForStateHead(req, res) {
  const state = req.params.state
  const stateHead = await userModel.find({ state, role: "state_head" })
  //total no of so in particullar state
  const soList = await userModel.find({ state, role: "so" })
  const noOfSo = soList.length
  console.log("no of so=", noOfSo)
  const shopList = await shopModel.find({ state })
  if (!shopList) {
    return res.status(404).json({
      message: "No shops found in this state",
      error: true,
      data: "[]",
    })
  }
  const totalShops = shopList.length
  const ordersCount = shopList.reduce(
    (acc, item) => acc + item.totalOrderCount,
    0
  )
  const totalOrderAmount = shopList.reduce(
    (acc, item) => acc + item.totalOrderAmount,
    0
  )
  const totalPaymentAmount = shopList.reduce(
    (acc, item) => acc + item.totalPaymentAmount,
    0
  )

  //by district
  const byDistrict = {}
  shopList.forEach((shop) => {
    if (byDistrict[shop.city]) {
      byDistrict[shop.city].totalOrders += shop.totalOrderCount
      byDistrict[shop.city].totalShops += 1
      byDistrict[shop.city].totalOrderAmount += shop.totalOrderAmount
      byDistrict[shop.city].totalPaymentAmount += shop.totalPaymentAmount
    } else {
      byDistrict[shop.city] = {
        totalShops: 1,
        totalOrderAmount: shop.totalOrderAmount,
        totalPaymentAmount: shop.totalPaymentAmount,
        totalOrders: shop.totalOrderCount,
      }
    }
  })

  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      byDistrict,
      totalShops,
      ordersCount,
      totalOrderAmount,
      totalPaymentAmount,
      stateHead,
      noOfSo,
    },
  })
}
//generate report for admin

async function generateReportForAdmin(req, res) {
  const shopList = await shopModel.find({})
  const totalShops = shopList.length
  const totalOrderAmount = shopList.reduce(
    (acc, item) => acc + item.totalOrderAmount,
    0
  )
  const totalPaymentAmount = shopList.reduce(
    (acc, item) => acc + item.totalPaymentAmount,
    0
  )
  const totalOrders = shopList.reduce(
    (acc, item) => acc + item.totalOrderCount,
    0
  )

  //state-wise
  const byState = {}
  shopList.forEach((shop) => {
    if (byState[shop.state]) {
      byState[shop.state].totalShops += 1
      byState[shop.state].totalOrderAmount += shop.totalOrderAmount
      byState[shop.state].totalPaymentAmount += shop.totalPaymentAmount
      byState[shop.state].totalOrders += shop.totalOrderCount
    } else {
      byState[shop.state] = {
        totalShops: 1,
        totalOrderAmount: shop.totalOrderAmount,
        totalPaymentAmount: shop.totalPaymentAmount,
        totalOrders: shop.totalOrderCount,
      }
    }
  })

  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      totalShops,
      totalOrderAmount,
      totalPaymentAmount,
      totalOrders,
      byState,
    },
  })
}
async function generateReportForAdminByDate(req, res) {
  let { startDate, endDate } = req.body
  console.log(startDate)
  console.log(endDate)
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  console.log(startDate)
  console.log(endDate)
  const orderList = await orderModel
    .find({
      date: { $gte: startDate, $lte: endDate },
    })
    .populate("shopId")
  console.log("order list", orderList)
  const shops = await shopModel.find({})
  //total no of orders
  const totalOrders = orderList.length

  const totalOrderAmount = orderList.reduce(
    (acc, item) => acc + item.totalAmount,
    0
  )
  const totalPaymentAmount = orderList.reduce(
    (acc, item) => acc + item.totalPayment,
    0
  )
  const totalShops = shops.length

  //state-wise
  const byState = {}
  orderList.forEach((order) => {
    if (byState[order.shopId.state]) {
      byState[order.shopId.state].totalOrders += 1
      byState[order.shopId.state].totalOrderAmount += order.totalAmount
      byState[order.shopId.state].totalPaymentAmount += order.totalPayment
    } else {
      byState[order.shopId.state] = {
        totalOrders: 1,
        totalOrderAmount: order.totalAmount,
        totalPaymentAmount: order.totalPayment,
        totalShops: 0,
      }
    }
  })
  shops.forEach((shop) => {
    if (byState[shop.state]) {
      byState[shop.state].totalShops += 1
    } else {
      byState[shop.state] = {
        totalOrders: 0,
        totalOrderAmount: 0,
        totalPaymentAmount: 0,
        totalShops: 1,
      }
    }
  })
  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      totalShops,
      totalOrders,
      totalOrderAmount,
      totalPaymentAmount,
      byState,
    },
  })
}
export {
  generateReportForSo,
  generateReportForStateHead,
  generateReportForAdmin,
  generateReportForAdminByDate,
}
