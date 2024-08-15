import attendanceModel from "../models/attendanceModel.js"
import shopModel from "../models/shopModel.js"
import cloudinaryv1 from "cloudinary"
const cloudinary = cloudinaryv1.v2
import path from "path"
import fs from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//for so
// mark attendance
export async function markAttendance(req, res) {
  const { userId, date, status, punchIn, role, districtVisited } = req.body
  try {
    const attendance = new attendanceModel({
      userId,
      date,
      status,
      punchIn,
      role,
      districtVisited,
    })
    const savedAttendance = await attendance.save()
    res.status(201).json({
      message: "Attendance marked successfully",
      error: false,
      data: { savedAttendance },
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
//check if so is present on particular day or not

export async function checkAttendance(req, res) {
  let { userId, date } = req.body
  date = new Date(date)
  try {
    const attendance = await attendanceModel.findOne({
      userId,
      date: {
        $gte: new Date(date.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(date.setUTCHours(23, 59, 59, 999)), // add 24 hours to get the next day's date
      },
    })
    if (attendance) {
      res.status(200).json({
        message: "Attendance found",
        error: false,
        present: true,
        data: attendance,
      })
    } else {
      res.status(200).json({
        message: "Attendance not found",
        error: false,
        present: false,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
//for add visit
//show all shop of a particular district

export async function getShopByDistrict(req, res) {
  let { district, soId } = req.body
  try {
    const shops = await shopModel.find({ city: district, so: soId })
    console.log("Shops", shops)
    res.status(200).json({
      message: "Shops found",
      error: false,
      data: shops,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
//add visit

export async function addVisit(req, res) {
  let { shopId, attendanceId, description, remark } = req.body
  const imageFile = req.files.image
  const uploadPath = path.join(__dirname, "uploads", imageFile.name)
  console.log(uploadPath)
  console.log("image hai", imageFile)
  //uploading image to cloudinary
  imageFile.mv(uploadPath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Some error occured in express-file upload" })
    } else {
      console.log("uploaded to local")
    }
  })

  const uploadedData = await cloudinary.uploader.upload(uploadPath, {
    folder: "uploads",
  })
  console.log("url hai", uploadedData)

  //making entry to db
  const updatedAttendance = await attendanceModel.findOneAndUpdate(
    { _id: attendanceId }, // Filter: find the document with this `_id`
    {
      $push: {
        shopVisited: {
          shopId: shopId,
          remark: remark,
          description: description,
          image: uploadedData.url,

          // Set the `lastVisited` field to the current date and time
        },
      },
    },
    { new: true }
  )
  res.status(200).json({
    message: "Visit added successfully",
    error: false,
    data: updatedAttendance,
  })
}

//list-visits

export async function listVisits(req, res) {
  let attendanceId = req.params.id
  try {
    const attendance = await attendanceModel
      .findById(attendanceId)
      .populate("shopVisited.shopId")

    res.status(200).json({
      message: "Visits found",
      error: false,
      data: attendance,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
//punch out
export async function punchOut(req, res) {
  let attendanceId = req.params.attendanceId
  try {
    const updatedAttendance = await attendanceModel.findOneAndUpdate(
      { _id: attendanceId }, // Filter: find the document with this `_id`
      {
        $set: {
          punchOut: new Date(),
        },
      },
      { new: true }
    )
    res.status(200).json({
      message: "Punch out marked successfully",
      error: false,
      data: updatedAttendance,
    })
  } catch (error) {
    res.status(500).json({ message: error.message, error: true })
  }
}
