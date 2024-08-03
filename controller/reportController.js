//report services for so
import orderModel from "../models/orderModel.js"
import shopModel from "../models/shopModel.js"
import userModel from "../models/userModel.js"

// async function generateReportForSo(req, res) {
//   const soId = req.params.soId
//   //so-info
//   const soInfo = await userModel.findById(soId).select("-password")
//   if (!soInfo) {
//     return res.status(404).json({
//       message: "SO not found",
//       error: true,
//       data: "[]",
//     })
//   }

//   //order report
//   const ordersOfSo = await orderModel.find({ so: soId }).populate("shopId")
//   if (!ordersOfSo) {
//     return res.status(404).json({
//       message: "No orders found for this SO",
//       error: "false",
//       data: "[]",
//     })
//   }
//   const totalOrders = ordersOfSo.length
//   const totalAmount = ordersOfSo.reduce(
//     (acc, order) => acc + order.totalAmount,
//     0
//   )
//   const totalPayment = ordersOfSo.reduce(
//     (acc, order) => acc + order.totalPayment,
//     0
//   )
//   //district wise
//   const ordersByDistrict = {}
//   ordersOfSo.forEach((order) => {
//     if (ordersByDistrict[order.shopId.city]) {
//       ordersByDistrict[order.shopId.city].totalAmount += order.totalAmount
//       ordersByDistrict[order.shopId.city].totalPayment += order.totalPayment
//       ordersByDistrict[order.shopId.city].ordersCount += 1
//     } else {
//       ordersByDistrict[order.shopId.city] = {
//         totalAmount: order.totalAmount,
//         totalPayment: order.totalPayment,
//         ordersCount: 1,
//       }
//     }
//   })

//   //shop report
//   const shopsOfSo = await shopModel.find({ so: soId }).populate("so")
//   if (!shopsOfSo) {
//     return res.status(404).json({
//       message: "No shops found for this SO",
//       error: "false",
//       data: "[]",
//     })
//   }
//   const totalShops = shopsOfSo.length
//   //shopsByDistrict
//   const shopsByDistrict = {}
//   shopsOfSo.forEach((shop) => {
//     if (shopsByDistrict[shop.city]) {
//       shopsByDistrict[shop.city].totalShops += 1
//     } else {
//       shopsByDistrict[shop.city] = {
//         totalShops: 1,
//       }
//     }
//   })

//   res.json({
//     message: "Report generated successfully",
//     error: false,
//     data: {
//       orders: {
//         totalOrders,
//         totalAmount,
//         totalPayment: totalPayment,
//         ordersByDistrict,
//       },

//       shops: {
//         totalShops,
//         shopsByDistrict,
//       },
//       so: soInfo,
//     },
//   })
// }

//new version
async function generateReportForSo(req, res) {
  const soId = req.params.soId
  // let startDate = "2024-08-01T00:00:00Z"
  // let endDate = "2024-08-04T00:00:00Z"

  let { startDate, endDate } = req.body

  const soInfo = await userModel.findById(soId)

  let orders = await orderModel.find({ so: soId }).populate("shopId")

  /*by district */
  if (startDate && endDate) {
    orders = orders.filter((order) => {
      return (
        new Date(order.date) >= new Date(startDate) &&
        new Date(order.date) <= new Date(endDate)
      )
    })
  } else if (startDate) {
    orders = orders.filter((order) => {
      return new Date(order.date) >= new Date(startDate)
    })
  } else if (endDate) {
    orders = orders.filter((order) => {
      return new Date(order.date) <= new Date(endDate)
    })
  }
  const byDistrict2 = {}
  //adding city
  soInfo.city.forEach((item) => {
    byDistrict2[item] = {
      name: item,
      totalOrderAmount: 0,
      totalPaymentAmount: 0,
      totalOrders: 0,
      totalShops: 0, // Initialize totalShops if not already
    }
  })
  orders.forEach((order) => {
    if (byDistrict2[order.shopId.city]) {
      byDistrict2[order.shopId.city].totalOrders += 1
      byDistrict2[order.shopId.city].totalOrderAmount += order.totalAmount
      byDistrict2[order.shopId.city].totalPaymentAmount += order.totalPayment
    } else {
      byDistrict2[order.shopId.city] = {
        name: order.shopId.city,
        totalOrderAmount: order.totalAmount,
        totalPaymentAmount: order.totalPayment,
        totalOrders: 1,
        totalShops: 0,
      }
    }
  })
  //adding remaining city
  const allShop = await shopModel.find({ so: soId })
  const totalShops = allShop.length

  for (const shop of allShop) {
    if (byDistrict2[shop.city]) {
      byDistrict2[shop.city].totalShops += 1
    } else {
      byDistrict2[shop.city] = {
        name: shop.city,

        totalOrderAmount: 0,
        totalPaymentAmount: 0,
        totalOrders: 0,
        totalShops: 0, // Initialize totalShops if not already
      }
    }
  }

  //total order amount
  let totalOrderAmount = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  )
  let totalPaymentAmount = orders.reduce(
    (acc, order) => acc + order.totalPayment,
    0
  )
  let ordersCount = orders.length
  // totalPaymentAmount = 0

  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      totalShops,
      totalOrderAmount,
      totalPaymentAmount,
      ordersCount,
      byDistrict: byDistrict2,
      soInfo,
    },
  })
}

async function generateReportForStateHead(req, res) {
  const state = req.params.state
  // let startDate = "2024-07-01T00:00:00Z"
  // let endDate = "2024-08-01T00:00:00Z"
  let { startDate, endDate } = req.body

  const stateHead = await userModel.find({ state, role: "state_head" })
  //total no of so in particullar state
  const soList = await userModel.find({ state, role: "so" })
  const noOfSo = soList.length
  console.log("no of so=", noOfSo)

  /*by disrict v2*/
  let matchStage = {
    "shopDetails.state": state,
  }

  // Add date range to match object if provided
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }
  } else if (startDate) {
    matchStage.date = {
      $gte: new Date(startDate),
    }
  } else if (endDate) {
    matchStage.orderDate = {
      $lte: new Date(endDate),
    }
  }

  let orders = await orderModel.aggregate([
    {
      $lookup: {
        from: "shops", // name of the 'so' collection in the database
        localField: "shopId",
        foreignField: "_id",
        as: "shopDetails",
      },
    },
    { $unwind: "$shopDetails" },
    { $match: matchStage },
  ])
  /*by district */
  const byDistrict2 = {}
  orders.forEach((order) => {
    if (byDistrict2[order.shopDetails.city]) {
      byDistrict2[order.shopDetails.city].totalOrders += 1
      byDistrict2[order.shopDetails.city].totalOrderAmount += order.totalAmount
      byDistrict2[order.shopDetails.city].totalPaymentAmount +=
        order.totalPayment
    } else {
      byDistrict2[order.shopDetails.city] = {
        name: order.shopDetails.city,
        totalOrderAmount: order.totalAmount,
        totalPaymentAmount: order.totalPayment,
        totalOrders: 1,
        totalShops: 0,
      }
    }
  })
  //adding remaining city
  const allShop = await shopModel.find({ state })
  const totalShops = allShop.length

  for (const shop of allShop) {
    if (byDistrict2[shop.city]) {
      byDistrict2[shop.city].totalShops += 1
    } else {
      byDistrict2[shop.city] = {
        name: shop.city,

        totalOrderAmount: 0,
        totalPaymentAmount: 0,
        totalOrders: 0,
        totalShops: 0, // Initialize totalShops if not already
      }
    }
  }

  /*by ends here disrict v2*/

  /*by so starts here*/

  //by SO
  matchStage = {
    "soDetails.state": state,
  }

  // Add date range to match object if provided
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    }
  } else if (startDate) {
    matchStage.date = {
      $gte: new Date(startDate),
    }
  } else if (endDate) {
    matchStage.orderDate = {
      $lte: new Date(endDate),
    }
  }

  orders = await orderModel.aggregate([
    {
      $lookup: {
        from: "users", // name of the 'so' collection in the database
        localField: "so",
        foreignField: "_id",
        as: "soDetails",
      },
    },
    { $unwind: "$soDetails" },
    { $match: matchStage },
  ])

  /*by so */
  const bySO = {}
  orders.forEach((order) => {
    if (bySO[order.soDetails._id]) {
      bySO[order.soDetails._id].totalOrders += 1
      bySO[order.soDetails._id].totalOrderAmount += order.totalAmount
      bySO[order.soDetails._id].totalPaymentAmount += order.totalPayment
    } else {
      bySO[order.soDetails._id] = {
        name: order.soDetails.name,
        totalOrderAmount: order.totalAmount,
        totalPaymentAmount: order.totalPayment,
        totalOrders: 1,
        totalShops: 0,
      }
    }
  })
  //adding total shops for each so&& if no sell
  const allSo = await userModel.find({ role: "so", state })

  for (const so of allSo) {
    if (bySO[so._id]) {
      const shopInfo = await shopModel.find({ so: so._id })
      const totalShops = shopInfo.length
      bySO[so._id].totalShops += totalShops
      console.log(totalShops)
    } else {
      const shopInfo = await shopModel.find({ so: so._id })
      const totalShops = shopInfo.length
      console.log(so._id)
      bySO[so._id] = {
        name: so.name,
        totalOrderAmount: 0,
        totalPaymentAmount: 0,
        totalOrders: 0,
        totalShops, // Initialize totalShops if not already
      }
    }
  }

  //total ordersCount
  const ordersCount = orders.length
  //total order amount
  const totalOrderAmount = orders.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  )

  //total payment amount
  const totalPaymentAmount = orders.reduce(
    (acc, order) => acc + order.totalPayment,
    0
  )

  res.json({
    message: "Report generated successfully",
    error: false,
    data: {
      totalShops,
      ordersCount,
      totalOrderAmount,
      totalPaymentAmount,
      stateHead,
      noOfSo,
      bySo: bySO,
      byDistrict: byDistrict2,
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
