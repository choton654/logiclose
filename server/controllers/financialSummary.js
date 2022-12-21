import Joi_Valodation from "../joi/api/index.js"
import {
    addClosingCapitalRepo,
    addDebtAssumptionRepo,
    addFinancialSummaryRepo, addPerformaRepo,
    addSourceFundRepo,
    getClosingCapitalRepo,
    getDebtAssumptionRepo,
    getFinancialSummaryRepo, getPerformaRepo,
    getSourceFundRepo,
    updateClosingCapitalRepo,
    updateDebtAssumptionRepo,
    updateFinancialSummaryRepo, updatePerformaRepo, updateSourceFundRepo
} from "../reposetory/financialSummary.js"
import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"

// import { v2 as cloudinary } from 'cloudinary'

// cloudinary.config({
//     cloud_name: process.env.CNAME,
//     api_key: process.env.CAPIKEY,
//     api_secret: process.env.CSECRET,
//     secure: true
// });

export const addFinancialSummary = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        if (!req.params.type || req.params.type === undefined) {
            return serverErrorResponse(res, 'Please select financial summary type')
        }

        const financialSummaryData = {
            userId: req.userId,
            title: req.body.title,
            featureData: req.body.reqData,
            isStepCompleted: true,
            type: req.params.type
        }
        const joiValidation = Joi_Valodation.financialSummaryJoi.validate(financialSummaryData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateFinancialSummaryRepo(req.body.id, financialSummaryData, req.params.type)
        } else {
            [err, data] = await addFinancialSummaryRepo(financialSummaryData, req.params.type)
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Financial summary data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getFinancialSummary = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        if (!req.params.type || req.params.type === undefined) {
            return serverErrorResponse(res, 'Please select financial summary type')
        }

        const [err, data] = await getFinancialSummaryRepo(req.userId, req.params.type)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find financial summary')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}


export const addSourceFund = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const sourceFundData = {
            userId: req.userId,
            title: req.body.title,
            purchasePrice: req.body.reqData.purchasePrice,
            loanAmount: req.body.reqData.loanAmount,
            equity: req.body.reqData.equity,
            syndicationFee: req.body.reqData.syndicationFee
        }
        const joiValidation = Joi_Valodation.sourceFundJoi.validate(sourceFundData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateSourceFundRepo(req.body.id, {
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        } else {
            [err, data] = await addSourceFundRepo({
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Source fund data altered')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getSourceFund = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getSourceFundRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find source funds')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addClosingCapital = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const closingCapitalData = {
            userId: req.userId,
            title: req.body.title,
            titleFee: req.body.reqData.titleFee,
            attorneyFee: req.body.reqData.attorneyFee,
            brokerfee: req.body.reqData.brokerfee,
            bankFee: req.body.reqData.bankFee
        }
        const joiValidation = Joi_Valodation.closingCapitalJoi.validate(closingCapitalData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateClosingCapitalRepo(req.body.id, {
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        } else {
            [err, data] = await addClosingCapitalRepo({
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Closing capital data altered')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getClosingCapital = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getClosingCapitalRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find closing capital')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addDebtAssumption = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const debtAssumptionData = {
            userId: req.userId,
            title: req.body.title,
            loanAmount: req.body.reqData.loanAmount,
            interest: req.body.reqData.interest,
            amortPeriod: req.body.reqData.amortPeriod,
            constant: req.body.reqData.constant
        }
        const joiValidation = Joi_Valodation.debtAssumptionJoi.validate(debtAssumptionData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateDebtAssumptionRepo(req.body.id, {
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        } else {
            [err, data] = await addDebtAssumptionRepo({
                title: req.body.title,
                userId: req.userId,
                isStepCompleted: req.body.isStepCompleted,
                ...req.body.reqData
            })
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Debt assumption data altered')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getDebtAssumption = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getDebtAssumptionRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find Debt assumption')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addPerforma = async (req, res) => {
    try {
        await handleMulter(req, res)
        // const excelFiles = req.files.filter(file => file.originalname.split('.')[file.originalname.split('.').length - 1] === 'xlsx')
        // const othersFile = req.files.filter(file => file.originalname.split('.')[file.originalname.split('.').length - 1] !== 'xlsx')
        // const multerReq = { files: othersFile }

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }
        // console.log('file', excelFiles[0]);
        // const xlFromdata = new FormData()
        // xlFromdata.append('file', JSON.stringify(excelFiles[0]))
        // xlFromdata.append('upload_preset', "gatherAll")
        // xlFromdata.append('api_key', '224248336432978')
        // const xlFromdata = {
        //     file: excelFiles[0],
        //     upload_preset: "gatherAll",
        //     api_key: 224248336432978,
        // };
        // fetch(`https://api.cloudinary.com/v1_1/toton007/raw/upload`, {
        //     body: xlFromdata,
        //     headers: { "content-type": "application/json" },
        //     method: "POST",
        // })
        //     .then((res) => res.json())
        //     .then((data1) => { console.log(data1) })
        //     .catch(err => { console.log(err) })

        // const base64Uri = Buffer.from(excelFiles[0].buffer).toString('base64')
        // console.log('base64Uri', excelFiles);
        // const uploadResponse = await cloudinary.uploader.upload_large(base64Uri)
        // console.log('uploadResponse', uploadResponse);

        // const noOfFiles = JSON.parse(req.body.noOfFiles)
        // const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)
        const otherImages = JSON.parse(req.body.otherImages)

        let performa = { images: [...otherImages, ...images] }

        // noOfNewFiles.forEach((item, idx) => {
        //     const performaObj = {}
        //     // const newImages = [...otherImages, ...images]
        //     let oldImagestart = 0
        //     if (idx > 0) {
        //         for (let i = 0; i < idx; i++) {
        //             oldImagestart += noOfFiles[i]
        //         }
        //     }
        //     let oldImageend = 0
        //     if (idx > 0) {
        //         for (let i = 0; i <= idx; i++) {
        //             oldImageend += noOfFiles[i]
        //         }
        //     }

        //     let newImagestart = 0
        //     if (idx > 0) {
        //         for (let i = 0; i < idx; i++) {
        //             newImagestart += noOfNewFiles[i]
        //         }
        //     }
        //     let newImageend = 0
        //     if (idx > 0) {
        //         for (let i = 0; i <= idx; i++) {
        //             newImageend += noOfNewFiles[i]
        //         }
        //     }

        //     const oldImagesArr = otherImages.slice(idx === 0 ? 0 : oldImagestart, idx === 0 ? noOfFiles[idx] : oldImageend)
        //     const newImagesArr = images.slice(idx === 0 ? 0 : newImagestart, idx === 0 ? noOfNewFiles[idx] : newImageend)

        //     performaObj['images'] = [...oldImagesArr, ...newImagesArr]
        //     // newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfFiles[idx] : end)
        //     performa.push(performaObj)
        // })

        const performaData = {
            userId: req.userId,
            title: req.body.title,
            isStepCompleted: true,
            performa
        }

        const joiValidation = Joi_Valodation.performaJoi.validate(performaData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updatePerformaRepo(req.body.id, performaData)
        } else {
            [err, data] = await addPerformaRepo(performaData)
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Performa added')
    } catch (error) {
        console.log('error', error);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getPerforma = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getPerformaRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find performa')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}
