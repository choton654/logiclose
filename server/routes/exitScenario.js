import express from "express"
import { addRefinance, addSaleScenario, getRefinance, getSaleScenario } from "../controllers/exitScenario.js"
import { userValidate } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(userValidate)

router.post('/refinance', addRefinance)
router.get("/refinance", getRefinance)

router.post('/saleScenario', addSaleScenario)
router.get("/saleScenario", getSaleScenario)

export default router