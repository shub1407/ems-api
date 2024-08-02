import express from "express"
import {
  generateReportForSo,
  generateReportForStateHead,
  generateReportForAdmin,
  generateReportForAdminByDate,
} from "../controller/reportController.js"
const reportRouter = express.Router()

reportRouter.get("/so/generate/:soId", generateReportForSo)

reportRouter.get("/state-head/generate/:state", generateReportForStateHead)
reportRouter.get("/admin/generate", generateReportForAdmin)
reportRouter.post("/admin/generate/date", generateReportForAdminByDate)

export default reportRouter
