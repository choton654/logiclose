import RefinanceScenario from "../models/exitScenarios/refinanceScenario.js"
import SaleScenario from "../models/exitScenarios/saleScenario.js"

export const addRefinanceRepo = async (data) => {
    try {
        const refinance = await RefinanceScenario.create(data)
        if (!refinance) {
            const errObj = {
                code: 400,
                message: "Refinance scenario creation error"
            }
            return [errObj, null]
        }
        return [null, refinance]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getRefinanceRepo = async (userId) => {
    try {
        const refinance = await RefinanceScenario.findOne({ userId })
        if (!refinance) {
            const errObj = {
                code: 400,
                message: "Can't find refinance scenario"
            }
            return [errObj, null]
        }
        return [null, refinance]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateRefinanceRepo = async (id, data) => {
    try {
        const refinance = await RefinanceScenario.findByIdAndUpdate(id, data, { new: true })
        if (!refinance) {
            const errObj = {
                code: 400,
                message: "Refinance scenario update error"
            }
            return [errObj, null]
        }
        return [null, refinance]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addSaleScenarioRepo = async (data) => {
    try {
        const saleScenario = await SaleScenario.create(data)
        if (!saleScenario) {
            const errObj = {
                code: 400,
                message: "Sale scenario creation error"
            }
            return [errObj, null]
        }
        return [null, saleScenario]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getSaleScenarioRepo = async (userId) => {
    try {
        const saleScenario = await SaleScenario.findOne({ userId })
        if (!saleScenario) {
            const errObj = {
                code: 400,
                message: "Can't find sale scenario"
            }
            return [errObj, null]
        }
        return [null, saleScenario]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateSaleScenarioRepo = async (id, data) => {
    try {
        const saleScenario = await SaleScenario.findByIdAndUpdate(id, data, { new: true })
        if (!saleScenario) {
            const errObj = {
                code: 400,
                message: "Sale scenario update error"
            }
            return [errObj, null]
        }
        return [null, saleScenario]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}