import PropertySummary from "../models/propertyDescription/propertySummary.js";
import CommunitySummary from "../models/propertyDescription/communitySummary.js"
import UnitFeature from "../models/propertyDescription/unitFeatures.js"
import FloorPlan from "../models/propertyDescription/floorPlans.js"
import Comps from "../models/propertyDescription/comps.js";


export const addPropertySummaryRepo = async (data) => {
    try {
        const propertySummary = await PropertySummary.create(data)
        if (!propertySummary) {
            const errObj = {
                code: 400,
                message: "Property summary creation error"
            }
            return [errObj, null]
        }
        return [null, propertySummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getPropertySummaryRepo = async (userId) => {
    try {
        const propertySummary = await PropertySummary.findOne({ userId })
        if (!propertySummary) {
            const errObj = {
                code: 400,
                message: "Can't find property summary"
            }
            return [errObj, null]
        }
        return [null, propertySummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updatePropertySummaryRepo = async (id, data) => {
    try {
        const propertySummary = await PropertySummary.findByIdAndUpdate(id, data, { new: true })
        if (!propertySummary) {
            const errObj = {
                code: 400,
                message: "Property summary update error"
            }
            return [errObj, null]
        }
        return [null, propertySummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getCommunityFeatureRepo = async (userId) => {
    try {
        const communityFeature = await CommunitySummary.findOne({ userId })
        if (!communityFeature) {
            const errObj = {
                code: 400,
                message: "Can't find community feature"
            }
            return [errObj, null]
        }
        return [null, communityFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addCommunityFeatureRepo = async (data) => {
    try {
        const communityFeature = await CommunitySummary.create(data)
        if (!communityFeature) {
            const errObj = {
                code: 400,
                message: "Community feature creation error"
            }
            return [errObj, null]
        }
        return [null, communityFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateCommunityFeatureRepo = async (id, data) => {
    try {
        const communityFeature = await CommunitySummary.findByIdAndUpdate(id, data, { new: true })
        if (!communityFeature) {
            const errObj = {
                code: 400,
                message: "Community feature update error"
            }
            return [errObj, null]
        }
        return [null, communityFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getUnitFeatureRepo = async (userId) => {
    try {
        const unitFeature = await UnitFeature.findOne({ userId })
        if (!unitFeature) {
            const errObj = {
                code: 400,
                message: "Can't find unit feature"
            }
            return [errObj, null]
        }
        return [null, unitFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addUnitFeatureRepo = async (data) => {
    try {
        const unitFeature = await UnitFeature.create(data)
        if (!unitFeature) {
            const errObj = {
                code: 400,
                message: "Unit feature creation error"
            }
            return [errObj, null]
        }
        return [null, unitFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateUnitFeatureRepo = async (id, data) => {
    try {
        const unitFeature = await UnitFeature.findByIdAndUpdate(id, data, { new: true })
        if (!unitFeature) {
            const errObj = {
                code: 400,
                message: "Unit feature update error"
            }
            return [errObj, null]
        }
        return [null, unitFeature]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getFloorPlansRepo = async (userId) => {
    try {
        const floorPlan = await FloorPlan.findOne({ userId })
        if (!floorPlan) {
            const errObj = {
                code: 400,
                message: "Can't find floor plans"
            }
            return [errObj, null]
        }
        return [null, floorPlan]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addFloorPlanRepo = async (data) => {
    try {
        const floorPlan = await FloorPlan.create(data)
        if (!floorPlan) {
            const errObj = {
                code: 400,
                message: "Unit feature creation error"
            }
            return [errObj, null]
        }
        return [null, floorPlan]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateFloorPlanRepo = async (id, data) => {
    try {
        const floorPlan = await FloorPlan.findByIdAndUpdate(id, data, { new: true })
        if (!floorPlan) {
            const errObj = {
                code: 400,
                message: "Unit feature update error"
            }
            return [errObj, null]
        }
        return [null, floorPlan]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addCompsRepo = async (data) => {
    try {
        const comps = await Comps.create(data)
        if (!comps) {
            const errObj = {
                code: 400,
                message: "Comps creation error"
            }
            return [errObj, null]
        }
        return [null, comps]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateCompsRepo = async (id, data) => {
    try {
        const comps = await Comps.findByIdAndUpdate(id, data, { new: true })
        if (!comps) {
            const errObj = {
                code: 400,
                message: "Comps update error"
            }
            return [errObj, null]
        }
        return [null, comps]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getCompsRepo = async (userId) => {
    try {
        const comps = await Comps.findOne({ userId })
        if (!comps) {
            const errObj = {
                code: 400,
                message: "Can't find comps"
            }
            return [errObj, null]
        }
        return [null, comps]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}