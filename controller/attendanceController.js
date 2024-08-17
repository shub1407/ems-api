import attendanceModel from "../models/attendanceModel.js"
import shopModel from "../models/shopModel.js"
import cloudinaryv1 from "cloudinary"
const cloudinary = cloudinaryv1.v2
import path from "path"
import fs from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import internal from "stream"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//for so
// mark attendance
export async function markAttendance(req, res) {
  let { userId, date, status, punchIn, role, districtVisited } = req.body

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
  //name is used for state head since no shop for state head
  let { shopId, attendanceId, description, remark, name } = req.body
  if (!name) {
    name = "Abc"
  }
  const file = req.file
  let uploadedData
  console.log("image hai", file)
  //uploading image to cloudinary

  uploadedData = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      }
    )

    uploadStream.end(req.file.buffer) // End the stream with the file buffer
  })
  console.log("url hai", uploadedData)

  // //making entry to db
  const updatedAttendance = await attendanceModel.findOneAndUpdate(
    { _id: attendanceId }, // Filter: find the document with this `_id`
    {
      $push: {
        shopVisited: {
          name: name,
          shopId: shopId,
          remark: remark,
          description: description,
          image: uploadedData.secure_url,

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

//attendance report section

export async function attendanceReport(req, res) {
  let userId = req.params.userId
  // convert to internal

  console.log(typeof userId)

  const attendanceData = await attendanceModel
    .find({ userId })
    .populate("shopVisited.shopId")
  res.status(200).json({
    message: "Attendance Report fetched successfully",
    error: false,
    data: { attendanceData },
  })
}
//apply leave
