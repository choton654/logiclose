import SourceFund from "../models/financialSummary/sourceFund.js"
import ClosingCapital from "../models/financialSummary/closingCapital.js"
import DebtAssumptions from "../models/financialSummary/debtAssumptions.js"
import AnnualRent from "../models/financialSummary/annualRent.js"
import Performa from "../models/financialSummary/performa.js"

export const getFinancialSummaryRepo = async (userId, type) => {
    try {
        let [err, result] = [null, null]
        if (type === 'sourceFund') {
            const sourceFund = await SourceFund.findOne({ userId })
            if (!sourceFund) {
                const errObj = {
                    code: 400,
                    message: "Can't find source fund"
                }
                return [errObj, null]
            }
            [err, result] = [null, sourceFund]

        } else if (type === 'closingCapital') {
            const closingCapital = await ClosingCapital.findOne({ userId })
            if (!closingCapital) {
                const errObj = {
                    code: 400,
                    message: "Can't find Closing Capital"
                }
                return [errObj, null]
            }
            [err, result] = [null, closingCapital]

        } else if (type === 'debtAssumptions') {
            const debtAssumptions = await DebtAssumptions.findOne({ userId })
            if (!debtAssumptions) {
                const errObj = {
                    code: 400,
                    message: "Can't find Debt Assumptions"
                }
                return [errObj, null]
            }
            [err, result] = [null, debtAssumptions]

        } else if (type === 'annualRent') {
            const annualRent = await AnnualRent.findOne({ userId })
            if (!annualRent) {
                const errObj = {
                    code: 400,
                    message: "Can't find Annual Rent"
                }
                return [errObj, null]
            }
            [err, result] = [null, annualRent]
        }
        return [err, result]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addFinancialSummaryRepo = async (data, type) => {
    try {
        let [err, result] = [null, null]
        if (type === 'sourceFund') {
            const sourceFund = await SourceFund.create(data)
            if (!sourceFund) {
                const errObj = {
                    code: 400,
                    message: "Source fund creation error"
                }
                return [errObj, null]
            }
            [err, result] = [null, sourceFund]

        } else if (type === 'closingCapital') {
            const closingCapital = await ClosingCapital.create(data)
            if (!closingCapital) {
                const errObj = {
                    code: 400,
                    message: "Closing Capital creation error"
                }
                return [errObj, null]
            }
            [err, result] = [null, closingCapital]

        } else if (type === 'debtAssumptions') {
            const debtAssumptions = await DebtAssumptions.create(data)
            if (!debtAssumptions) {
                const errObj = {
                    code: 400,
                    message: "Debt Assumptions creation error"
                }
                return [errObj, null]
            }
            [err, result] = [null, debtAssumptions]

        } else if (type === 'annualRent') {
            const annualRent = await AnnualRent.create(data)
            if (!annualRent) {
                const errObj = {
                    code: 400,
                    message: "Annual Rent creation error"
                }
                return [errObj, null]
            }
            [err, result] = [null, annualRent]
        }
        return [err, result]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateFinancialSummaryRepo = async (id, data, type) => {
    try {
        let [err, result] = [null, null]
        if (type === 'sourceFund') {
            const sourceFund = await SourceFund.findByIdAndUpdate(id, data, { new: true })
            if (!sourceFund) {
                const errObj = {
                    code: 400,
                    message: "Source fund update error"
                }
                return [errObj, null]
            }
            [err, result] = [null, sourceFund]

        } else if (type === 'closingCapital') {
            const closingCapital = await ClosingCapital.findByIdAndUpdate(id, data, { new: true })
            if (!closingCapital) {
                const errObj = {
                    code: 400,
                    message: "Closing Capital update error"
                }
                return [errObj, null]
            }
            [err, result] = [null, closingCapital]

        } else if (type === 'debtAssumptions') {
            const debtAssumptions = await DebtAssumptions.findByIdAndUpdate(id, data, { new: true })
            if (!debtAssumptions) {
                const errObj = {
                    code: 400,
                    message: "Debt Assumptions update error"
                }
                return [errObj, null]
            }
            [err, result] = [null, debtAssumptions]

        } else if (type === 'annualRent') {
            const annualRent = await AnnualRent.findByIdAndUpdate(id, data, { new: true })
            if (!annualRent) {
                const errObj = {
                    code: 400,
                    message: "Annual Rent update error"
                }
                return [errObj, null]
            }
            [err, result] = [null, annualRent]
        }
        return [err, result]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addPerformaRepo = async (data) => {
    try {
        const performa = await Performa.create(data)
        if (!performa) {
            const errObj = {
                code: 400,
                message: "Performa creation error"
            }
            return [errObj, null]
        }
        return [null, performa]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updatePerformaRepo = async (id, data) => {
    try {
        const performa = await Performa.findByIdAndUpdate(id, data, { new: true })
        if (!performa) {
            const errObj = {
                code: 400,
                message: "Performa update error"
            }
            return [errObj, null]
        }
        return [null, performa]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getPerformaRepo = async (userId) => {
    try {
        const performa = await Performa.findOne({ userId })
        if (!performa) {
            const errObj = {
                code: 400,
                message: "Can't find performa"
            }
            return [errObj, null]
        }
        return [null, performa]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addSourceFundRepo = async (data) => {
    try {
        const sourceFund = await SourceFund.create(data)
        if (!sourceFund) {
            const errObj = {
                code: 400,
                message: "Source fund creation error"
            }
            return [errObj, null]
        }
        return [null, sourceFund]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getSourceFundRepo = async (userId) => {
    try {
        const sourceFund = await SourceFund.findOne({ userId })
        if (!sourceFund) {
            const errObj = {
                code: 400,
                message: "Can't find source fund"
            }
            return [errObj, null]
        }
        return [null, sourceFund]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateSourceFundRepo = async (id, data) => {
    try {
        const sourceFund = await SourceFund.findByIdAndUpdate(id, data, { new: true })
        if (!sourceFund) {
            const errObj = {
                code: 400,
                message: "Source fund update error"
            }
            return [errObj, null]
        }
        return [null, sourceFund]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addClosingCapitalRepo = async (data) => {
    try {
        const closingCapital = await ClosingCapital.create(data)
        if (!closingCapital) {
            const errObj = {
                code: 400,
                message: "Closing capital creation error"
            }
            return [errObj, null]
        }
        return [null, closingCapital]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateClosingCapitalRepo = async (id, data) => {
    try {
        const closingCapital = await ClosingCapital.findByIdAndUpdate(id, data, { new: true })
        if (!closingCapital) {
            const errObj = {
                code: 400,
                message: "Closing Capital update error"
            }
            return [errObj, null]
        }
        return [null, closingCapital]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getClosingCapitalRepo = async (userId) => {
    try {
        const closingCapital = await ClosingCapital.findOne({ userId })
        if (!closingCapital) {
            const errObj = {
                code: 400,
                message: "Can't find closing capital"
            }
            return [errObj, null]
        }
        return [null, closingCapital]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addDebtAssumptionRepo = async (data) => {
    try {
        const debtAssumptions = await DebtAssumptions.create(data)
        if (!debtAssumptions) {
            const errObj = {
                code: 400,
                message: "Debt assumption creation error"
            }
            return [errObj, null]
        }
        return [null, debtAssumptions]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateDebtAssumptionRepo = async (id, data) => {
    try {
        const debtAssumptions = await DebtAssumptions.findByIdAndUpdate(id, data, { new: true })
        if (!debtAssumptions) {
            const errObj = {
                code: 400,
                message: "Debt assumption update error"
            }
            return [errObj, null]
        }
        return [null, debtAssumptions]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getDebtAssumptionRepo = async (userId) => {
    try {
        const debtAssumptions = await DebtAssumptions.findOne({ userId })
        if (!debtAssumptions) {
            const errObj = {
                code: 400,
                message: "Can't find debt assumption"
            }
            return [errObj, null]
        }
        return [null, debtAssumptions]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}