import express from "express"
import {
    addPropertySummary, addUnitFeatures,
    addFloorPlan, getPropertySummary,
    updatePropertySummary, addCommunityFeature,
    getCommunityFeature, updateCommunityFeature,
    getUnitFeature, getFloorPlans,
    updateUnitFeatures,
    addComps, getComps,
    getPlaceDetails
} from "../controllers/propertyDescription.js"
import { userValidate } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(userValidate)

router.post('/summary', addPropertySummary)
router.get('/summary', getPropertySummary)
router.put('/summary', updatePropertySummary)

router.post('/community', addCommunityFeature)
router.get('/community', getCommunityFeature)
router.put('/community', updateCommunityFeature)


router.post('/unitfeature', addUnitFeatures)
router.get('/unitfeature', getUnitFeature)
router.put('/unitfeature', updateUnitFeatures)


router.post('/floorPlan', addFloorPlan)
router.get("/floorPlan", getFloorPlans)

router.post("/comps", addComps)
router.get("/comps", getComps)

router.post("/placeDetails", getPlaceDetails)


export default router