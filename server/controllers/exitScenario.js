import Joi_Valodation from "../joi/api/index.js"
import {
    addRefinanceRepo, addSaleScenarioRepo,
    getRefinanceRepo, getSaleScenarioRepo,
    updateRefinanceRepo, updateSaleScenarioRepo
} from "../reposetory/exitScenario.js"
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"

export const addRefinance = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const refinanceData = {
            userId: req.userId,
            title: req.body.title,
            year: req.body.reqData.year,
            noi: req.body.reqData.noi,
            interestRate: req.body.reqData.interestRate,
            constant: req.body.reqData.constant
        }
        const joiValidation = Joi_Valodation.refinanceJoi.validate(refinanceData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        // let others = []
        // if (Object.keys(req.body.reqData).length > 4) {
        //     Object.values(req.body.reqData).slice(4, req.body.reqData.length).forEach(item => {
        //         others.push(item)
        //     })
        // }
        // req.body.reqData['others'] = others

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateRefinanceRepo(req.body.id, {
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        } else {
            [err, data] = await addRefinanceRepo({
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Refinance Scenario data altered')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getRefinance = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getRefinanceRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find refinance scenario')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addSaleScenario = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const saleScenarioData = {
            userId: req.userId,
            title: req.body.title,
            year: req.body.reqData.year,
            noi: req.body.reqData.noi,
            exitCapRate: req.body.reqData.exitCapRate,
            salePrice: req.body.reqData.salePrice
        }
        const joiValidation = Joi_Valodation.saleScenarioJoi.validate(saleScenarioData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        // let others = []
        // if (Object.keys(req.body.reqData).length > 4) {
        //     Object.values(req.body.reqData).slice(4, req.body.reqData.length).forEach(item => {
        //         others.push(item)
        //     })
        // }
        // req.body.reqData['others'] = others

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateSaleScenarioRepo(req.body.id, {
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        } else {
            [err, data] = await addSaleScenarioRepo({
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Sale Scenario data altered')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getSaleScenario = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getSaleScenarioRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find sale scenario')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}