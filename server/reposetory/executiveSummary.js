import InvestmentSummary from "../models/executiveSummary/investmentSummary.js";
import InvestmentOppurtunity from "../models/executiveSummary/investmentOpportunity.js"
import DemoraphicSummary from "../models/executiveSummary/demographicSummary.js"

export const getInvestmentSummaryRepo = async (userId) => {
    try {
        const investmentSummary = await InvestmentSummary.findOne({ userId })
        if (!investmentSummary) {
            const errObj = {
                code: 400,
                message: "Can't find investment summary"
            }
            return [errObj, null]
        }
        return [null, investmentSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getInvestmentOpportunityRepo = async (userId) => {
    try {
        const investmentOpportunity = await InvestmentOppurtunity.findOne({ userId })
        if (!investmentOpportunity) {
            const errObj = {
                code: 400,
                message: "Can't find investment opportunity"
            }
            return [errObj, null]
        }
        return [null, investmentOpportunity]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getDemographicSummaryRepo = async (userId) => {
    try {
        const demoraphicSummary = await DemoraphicSummary.findOne({ userId })
        if (!demoraphicSummary) {
            const errObj = {
                code: 400,
                message: "Can't find demographic summary"
            }
            return [errObj, null]
        }
        return [null, demoraphicSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateInvestmentSummaryRepo = async (id, data) => {
    try {
        const investmentSummary = await InvestmentSummary.findByIdAndUpdate(id, data, { new: true })
        if (!investmentSummary) {
            const errObj = {
                code: 400,
                message: "Investment summary update error"
            }
            return [errObj, null]
        }
        return [null, investmentSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateInvestmentOpportunityRepo = async (id, data) => {
    try {
        const investmentOpportunity = await InvestmentOppurtunity.findByIdAndUpdate(id, data, { new: true })
        if (!investmentOpportunity) {
            const errObj = {
                code: 400,
                message: "Investment opportunity update error"
            }
            return [errObj, null]
        }
        return [null, investmentOpportunity]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateDemographicSummaryRepo = async (id, data) => {
    try {
        const demoraphicSummary = await DemoraphicSummary.findByIdAndUpdate(id, data, { new: true })
        if (!demoraphicSummary) {
            const errObj = {
                code: 400,
                message: "Demographic summary update error"
            }
            return [errObj, null]
        }
        return [null, demoraphicSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addInvestmentSummaryRepo = async (data) => {
    try {
        const investmentSummary = await InvestmentSummary.create(data)
        if (!investmentSummary) {
            const errObj = {
                code: 400,
                message: "Investment summary creation error"
            }
            return [errObj, null]
        }
        return [null, investmentSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addInvestmentOpportunityRepo = async (data) => {
    try {
        const investmentOpportunity = await InvestmentOppurtunity.create(data)
        if (!investmentOpportunity) {
            const errObj = {
                code: 400,
                message: "Investment opportunity creation error"
            }
            return [errObj, null]
        }
        return [null, investmentOpportunity]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addDemographicSummaryRepo = async (data) => {
    try {
        const demoraphicSummary = await DemoraphicSummary.create(data)
        if (!demoraphicSummary) {
            const errObj = {
                code: 400,
                message: "Demographic summary creation error"
            }
            return [errObj, null]
        }
        return [null, demoraphicSummary]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
} 