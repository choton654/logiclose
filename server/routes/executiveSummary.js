import express from "express"
import { addInvestment, addDemographicSummary, getInvestment, updateInvestment, getDemographicSummary, updateDemographicSummary } from "../controllers/executiveSummary.js"
import { userValidate } from "../middlewares/auth.middlewares.js"
const router = express.Router()

router.use(userValidate)

router.get('/investment', getInvestment)
router.post('/investment', addInvestment)
router.put('/investment', updateInvestment)

router.get('/demographic', getDemographicSummary)
router.post('/demographic', addDemographicSummary)
router.put('/demographic', updateDemographicSummary)


export default router