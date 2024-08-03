import express from "express"
import {
  generateReportForSo,
  generateReportForStateHead,
  generateReportForAdmin,
  generateReportForAdminByDate,
} from "../controller/reportController.js"
const reportRouter = express.Router()

reportRouter.post("/so/generate/:soId", generateReportForSo)

reportRouter.post("/state-head/generate/:state", generateReportForStateHead)
reportRouter.get("/admin/generate", generateReportForAdmin)
reportRouter.post("/admin/generate/date", generateReportForAdminByDate)

export default reportRouter
