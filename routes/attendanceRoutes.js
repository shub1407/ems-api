import express from "express"
const attendanceRouter = express.Router()
import {
  markAttendance,
  checkAttendance,
  getShopByDistrict,
  addVisit,
  listVisits,
  punchOut,
} from "../controller/attendanceController.js"

attendanceRouter.post("/so/mark-attendance", markAttendance)

attendanceRouter.post("/so/check-attendance/", checkAttendance)

attendanceRouter.post("/so/shop/district", getShopByDistrict)

attendanceRouter.post("/so/shop/add-visit", addVisit)

attendanceRouter.get("/so/list-visits/:id", listVisits)
attendanceRouter.post("/so/punch-out/:attendanceId", punchOut)

export default attendanceRouter
