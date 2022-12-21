import express from 'express'
import {
    addClosingCapital, addDebtAssumption, addFinancialSummary,
    addPerforma, addSourceFund, getClosingCapital,
    getDebtAssumption,
    getFinancialSummary, getPerforma, getSourceFund
} from '../controllers/financialSummary.js'
import { userValidate } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(userValidate)

router.post('/sourceFund', addSourceFund)
router.get('/sourceFund', getSourceFund)

router.post('/closingCapital', addClosingCapital)
router.get('/closingCapital', getClosingCapital)

router.post('/debtAssumptions', addDebtAssumption)
router.get('/debtAssumptions', getDebtAssumption)

router.post('/performa', addPerforma)
router.get('/performa', getPerforma)

router.post('/summary/:type', addFinancialSummary)
router.get('/summary/:type', getFinancialSummary)




export default router