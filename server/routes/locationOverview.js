import express from 'express'
import { addLocationSummary, getLocationSummary, addEmployers, getEmployers } from '../controllers/locationOverview.js'
import { userValidate } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(userValidate)

router.post('/locationSummary', addLocationSummary)
router.get('/locationSummary', getLocationSummary)

router.post('/employers', addEmployers)
router.get('/employers', getEmployers)

export default router