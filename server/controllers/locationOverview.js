import Joi_Valodation from "../joi/api/index.js"
import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import { addEmployersRepo, addLocationSummaryRepo, getEmployersRepo, getLocationSummaryRepo, updateEmployersRepo, updateLocationSummaryRepo } from "../reposetory/locationOverview.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"

export const addLocationSummary = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        await handleMulter(req, res)
        const subTitleArr = JSON.parse(req.body.subTitleArr)
        const subTitleTextArr = JSON.parse(req.body.subTitleTextArr)
        const noOfFiles = JSON.parse(req.body.noOfFiles)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)
        const otherImages = JSON.parse(req.body.otherImages)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }

        let locationSummary = []

        if (req.body.id) {
            subTitleArr.forEach((item, idx) => {
                const locationSummaryObj = {}
                locationSummaryObj['subTitle'] = item
                locationSummaryObj['subTitleText'] = subTitleTextArr[idx]

                let oldImagestart = 0
                if (idx > 0) {
                    for (let i = 0; i < idx; i++) {
                        oldImagestart += noOfFiles[i]
                    }
                }
                let oldImageend = 0
                if (idx > 0) {
                    for (let i = 0; i <= idx; i++) {
                        oldImageend += noOfFiles[i]
                    }
                }

                let newImagestart = 0
                if (idx > 0) {
                    for (let i = 0; i < idx; i++) {
                        newImagestart += noOfNewFiles[i]
                    }
                }
                let newImageend = 0
                if (idx > 0) {
                    for (let i = 0; i <= idx; i++) {
                        newImageend += noOfNewFiles[i]
                    }
                }

                let oldImagesArr = otherImages.slice(idx === 0 ? 0 : oldImagestart, idx === 0 ? noOfFiles[idx] : oldImageend)
                const newImagesArr = images.slice(idx === 0 ? 0 : newImagestart, idx === 0 ? noOfNewFiles[idx] : newImageend)
                oldImagesArr = oldImagesArr.filter(item => item)
                locationSummaryObj['images'] = [...oldImagesArr, ...newImagesArr]
                locationSummary.push(locationSummaryObj)
            })
        } else {
            subTitleArr.forEach((item, idx) => {
                const locationSummaryObj = {}
                const newImages = [...images]
                locationSummaryObj['subTitle'] = item
                locationSummaryObj['subTitleText'] = subTitleTextArr[idx]

                let start = 0
                if (idx > 0) {
                    for (let i = 0; i < idx; i++) {
                        start += noOfNewFiles[i]
                    }
                }
                let end = 0
                if (idx > 0) {
                    for (let i = 0; i <= idx; i++) {
                        end += noOfNewFiles[i]
                    }
                }

                locationSummaryObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfNewFiles[idx] : end)
                locationSummary.push(locationSummaryObj)
            })
        }
        const newlocationSummaryObj = {
            userId: req.userId,
            title: req.body.title,
            locationSummary,
            isStepCompleted: true
        }

        const joiValidation = Joi_Valodation.locationSummaryJoi.validate(newlocationSummaryObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }
        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateLocationSummaryRepo(req.body.id, newlocationSummaryObj)
        } else {
            [err, data] = await addLocationSummaryRepo(newlocationSummaryObj)
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Location summary added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getLocationSummary = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getLocationSummaryRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find location summary')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addEmployers = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const employersData = {
            userId: req.userId,
            title: req.body.title,
            employers: req.body.reqData,
            isStepCompleted: true
        }
        const joiValidation = Joi_Valodation.employersJoi.validate(employersData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateEmployersRepo(req.body.id, employersData)
        } else {
            [err, data] = await addEmployersRepo(employersData)
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Employers data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getEmployers = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getEmployersRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find employers data')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}