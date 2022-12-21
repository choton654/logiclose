import Joi_Valodation from "../joi/api/index.js"
import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"
import {
    addDemographicSummaryRepo,
    addInvestmentOpportunityRepo,
    addInvestmentSummaryRepo,
    getDemographicSummaryRepo,
    getInvestmentOpportunityRepo,
    getInvestmentSummaryRepo,
    updateDemographicSummaryRepo,
    updateInvestmentOpportunityRepo,
    updateInvestmentSummaryRepo
} from "../reposetory/executiveSummary.js";


export const getInvestment = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        let [err, data] = [null, null]
        if (req.query.type === 'summary') {
            [err, data] = await getInvestmentSummaryRepo(req.userId)
        } else if (req.query.type === 'opportunity') {
            [err, data] = await getInvestmentOpportunityRepo(req.userId)
        } else {
            return serverErrorResponse(res, 'Please specify correct investment type')
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find investment data')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addInvestment = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const investmentData = {
            userId: req.userId,
            descriptionArr: req.body.descriptionArr,
            title: req.body.title,
            isStepCompleted: req.body.isStepCompleted,
        }
        const joiValidation = Joi_Valodation.investmentJoi.validate(investmentData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        let [err, data] = [null, null]
        if (req.query.type === 'summary') {
            [err, data] = await addInvestmentSummaryRepo(investmentData)
        } else if (req.query.type === 'opportunity') {
            [err, data] = await addInvestmentOpportunityRepo(investmentData)
        } else {
            return serverErrorResponse(res, 'Please specify correct investment type')
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Investment data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const updateInvestment = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const investmentData = {
            userId: req.userId,
            descriptionArr: req.body.descriptionArr,
            title: req.body.title,
            isStepCompleted: true
        }
        const joiValidation = Joi_Valodation.investmentJoi.validate(investmentData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        let [err, data] = [null, null]
        if (req.query.type === 'summary') {
            [err, data] = await updateInvestmentSummaryRepo(req.body.id, investmentData)
        } else if (req.query.type === 'opportunity') {
            [err, data] = await updateInvestmentOpportunityRepo(req.body.id, investmentData)
        } else {
            return serverErrorResponse(res, 'Please specify correct investment type')
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Investment data updated')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addDemographicSummary = async (req, res) => {
    try {
        await handleMulter(req, res)
        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }
        const descriptionArr = JSON.parse(req.body.descriptionArr)
        const otherImages = JSON.parse(req.body.images)
        const demographicData = {
            userId: req.userId,
            descriptionArr,
            title: req.body.title,
            isStepCompleted: true,
            images: [...images, ...otherImages]
        }
        const joiValidation = Joi_Valodation.demographicJoi.validate(demographicData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        demographicData['isStepCompleted'] = req.body.isStepCompleted
        const [err, data] = await addDemographicSummaryRepo(demographicData)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Demographic summary added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getDemographicSummary = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getDemographicSummaryRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find demographic summary')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const updateDemographicSummary = async (req, res) => {
    try {
        await handleMulter(req, res)
        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }
        const descriptionArr = JSON.parse(req.body.descriptionArr)
        const otherImages = JSON.parse(req.body.images)
        const demographicData = {
            userId: req.userId,
            descriptionArr,
            title: req.body.title,
            isStepCompleted: true,
            images: [...images, ...otherImages]
        }
        const joiValidation = Joi_Valodation.demographicJoi.validate(demographicData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        const [err, data] = await updateDemographicSummaryRepo(req.body.id, demographicData)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Demographic summary updated')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}