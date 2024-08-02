import express from "express"

const stateHeadRouter = express.Router()
import { listSo, listShopsOfSo } from "../controller/stateHeadController.js"
stateHeadRouter.get("/list-so/:state", listSo)

stateHeadRouter.get("/list-shops", listShopsOfSo)

export default stateHeadRouter
