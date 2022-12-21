import express from 'express'
import userRouter from "./userRoutes.js"
import executiveSummaryRouter from "./executiveSummary.js"
import propertyDescriptionRouter from "./propertyDescription.js"
import locationOverviewRouter from "./locationOverview.js"
import financialSummaryRouter from "./financialSummary.js"
import exitScenarioRouter from "./exitScenario.js"
import { uploadFile } from '../controllers/uploadFile.js'
import { userValidate } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/executiveSummary', executiveSummaryRouter)
router.use('/propertyDescription', propertyDescriptionRouter)
router.use('/exitScenario', exitScenarioRouter)
router.use('/locationOverview', locationOverviewRouter)
router.use('/financialSummary', financialSummaryRouter)
router.use('/uploadfile', userValidate, uploadFile)

export default router