import Joi_Valodation from "../joi/api/index.js"
import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"
import {
    addCommunityFeatureRepo, addCompsRepo, addFloorPlanRepo,
    addPropertySummaryRepo, addUnitFeatureRepo,
    getCommunityFeatureRepo,
    getCompsRepo,
    getFloorPlansRepo,
    getPropertySummaryRepo,
    getUnitFeatureRepo,
    updateCommunityFeatureRepo,
    updateCompsRepo,
    updateFloorPlanRepo,
    updatePropertySummaryRepo,
    updateUnitFeatureRepo
} from "../reposetory/propertyDescription.js";
import axios from "axios";

export const addPropertySummary = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const propertySummaryData = {
            userId: req.userId,
            title: req.body.title,
            propertyAddress: req.body.reqData.propertyAddress,
            yearBuilt: req.body.reqData.yearBuilt,
            netwark: req.body.reqData.netwark,
            units: req.body.reqData.units
        }
        const joiValidation = Joi_Valodation.propertySummaryJoi.validate(propertySummaryData)
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
        const [err, data] = await addPropertySummaryRepo({
            title: req.body.title,
            userId: req.userId,
            isStepCompleted: req.body.isStepCompleted,
            ...req.body.reqData
        })

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Property Summary data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getPropertySummary = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getPropertySummaryRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find property summary')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const updatePropertySummary = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const propertySummaryData = {
            userId: req.userId,
            title: req.body.title,
            propertyAddress: req.body.reqData.propertyAddress,
            yearBuilt: req.body.reqData.yearBuilt,
            netwark: req.body.reqData.netwark,
            units: req.body.reqData.units,
        }
        const joiValidation = Joi_Valodation.propertySummaryJoi.validate(propertySummaryData)
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
        const [err, data] = await updatePropertySummaryRepo(req.body.id, {
            title: req.body.title,
            userId: req.userId,
            ...req.body.reqData,
            isStepCompleted: true,
        })

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Property Summary data updated')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getCommunityFeature = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getCommunityFeatureRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find property summary')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addCommunityFeature = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const communitySummaryData = {
            userId: req.userId,
            title: req.body.title,
            featureData: req.body.reqData
        }
        const joiValidation = Joi_Valodation.communityFeatureJoi.validate(communitySummaryData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        const [err, data] = await addCommunityFeatureRepo({
            title: req.body.title,
            userId: req.userId,
            featureData: req.body.reqData,
            isStepCompleted: req.body.isStepCompleted
        })
        // const resolvedPeomises = await Promise.all(promises)
        // const data = resolvedPeomises.map(item => item[1])
        // const err = resolvedPeomises.map(item => item[0])
        // const checkErr = err.some(error => error !== null)
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Community feature data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const updateCommunityFeature = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const communitySummaryData = {
            userId: req.userId,
            title: req.body.title,
            featureData: req.body.reqData
        }
        const joiValidation = Joi_Valodation.communityFeatureJoi.validate(communitySummaryData)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        const [err, data] = await updateCommunityFeatureRepo(req.body.id, {
            title: req.body.title,
            userId: req.userId,
            featureData: req.body.reqData,
            isStepCompleted: true,
        })
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Community feature data updated')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addUnitFeatures = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        await handleMulter(req, res)
        const subTitleArr = JSON.parse(req.body.subTitleArr)
        const subTitleTextArr = JSON.parse(req.body.subTitleTextArr)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }

        let unitFeatures = []
        subTitleArr.forEach((item, idx) => {
            const unitfeatureObj = {}
            const newImages = [...images]
            unitfeatureObj['subTitle'] = item
            unitfeatureObj['subTitleText'] = subTitleTextArr[idx]

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

            unitfeatureObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfNewFiles[idx] : end)
            unitFeatures.push(unitfeatureObj)
        })
        const newUnitFeatureObj = {
            userId: req.userId,
            title: req.body.title,
            unitFeatures,
            isStepCompleted: req.body.isStepCompleted
        }

        const joiValidation = Joi_Valodation.unitFeaturejoi.validate(newUnitFeatureObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }
        const [err, data] = await addUnitFeatureRepo(newUnitFeatureObj)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Unit features added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const updateUnitFeatures = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        await handleMulter(req, res)
        if (!req.body.id) {
            return serverErrorResponse(res, 'Need id to update')
        }
        const subTitleArr = JSON.parse(req.body.subTitleArr)
        const subTitleTextArr = JSON.parse(req.body.subTitleTextArr)
        const otherImages = JSON.parse(req.body.otherImages)
        const noOfFiles = JSON.parse(req.body.noOfFiles)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }

        let unitFeatures = []
        subTitleArr.forEach((item, idx) => {
            const unitfeatureObj = {}
            // const newImages = [...otherImages, ...images]
            unitfeatureObj['subTitle'] = item
            unitfeatureObj['subTitleText'] = subTitleTextArr[idx]

            // let start = 0
            // if (idx > 0) {
            //     for (let i = 0; i < idx; i++) {
            //         start += noOfFiles[i]
            //     }
            // }
            // let end = 0
            // if (idx > 0) {
            //     for (let i = 0; i <= idx; i++) {
            //         end += noOfFiles[i]
            //     }
            // }

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
            unitfeatureObj['images'] = [...oldImagesArr, ...newImagesArr]
            // unitfeatureObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfFiles[idx] : end)
            unitFeatures.push(unitfeatureObj)
        })
        const newUnitFeatureObj = {
            userId: req.userId,
            title: req.body.title,
            unitFeatures,
            isStepCompleted: true
        }

        const joiValidation = Joi_Valodation.unitFeaturejoi.validate(newUnitFeatureObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }
        const [err, data] = await updateUnitFeatureRepo(req.body.id, newUnitFeatureObj)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Unit features added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getUnitFeature = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getUnitFeatureRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find unit feature')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getFloorPlans = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getFloorPlansRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find unit feature')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addFloorPlan = async (req, res) => {
    try {
        await handleMulter(req, res)
        const bedRoomArr = JSON.parse(req.body.bedRoomArr)
        const washRoomArr = JSON.parse(req.body.washRoomArr)
        const sqrFtArr = JSON.parse(req.body.sqrFtArr)
        const avgRentArr = JSON.parse(req.body.avgRentArr)
        const floorNameArr = JSON.parse(req.body.floorNameArr)
        const otherImages = JSON.parse(req.body.otherImages)
        const noOfFiles = JSON.parse(req.body.noOfFiles)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }

        let floorPlans = []
        if (req.body.id) {
            bedRoomArr.forEach((item, idx) => {
                const floorPlanObj = {}
                floorPlanObj['bedRoom'] = item
                floorPlanObj['washRoom'] = washRoomArr[idx]
                floorPlanObj['sqrFt'] = sqrFtArr[idx]
                floorPlanObj['avgRent'] = avgRentArr[idx]
                floorPlanObj['floorName'] = floorNameArr[idx] ? floorNameArr[idx] : undefined

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
                floorPlanObj['images'] = [...oldImagesArr, ...newImagesArr]
                floorPlans.push(floorPlanObj)
            })
        } else {
            bedRoomArr.forEach((item, idx) => {
                const floorPlanObj = {}
                const newImages = [...images]
                floorPlanObj['bedRoom'] = item
                floorPlanObj['washRoom'] = washRoomArr[idx]
                floorPlanObj['sqrFt'] = sqrFtArr[idx]
                floorPlanObj['avgRent'] = avgRentArr[idx]
                floorPlanObj['floorName'] = floorNameArr[idx] ? floorNameArr[idx] : undefined

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

                floorPlanObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfNewFiles[idx] : end)
                floorPlans.push(floorPlanObj)
            })

        }
        const newFloorPlanObj = {
            userId: req.userId,
            title: req.body.title,
            isStepCompleted: true,
            floorPlans
        }

        const joiValidation = Joi_Valodation.floorPlanjoi.validate(newFloorPlanObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateFloorPlanRepo(req.body.id, newFloorPlanObj)
        } else {
            [err, data] = await addFloorPlanRepo(newFloorPlanObj)
        }

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Floor plans added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addComps = async (req, res) => {
    try {
        await handleMulter(req, res)
        const labelArr = JSON.parse(req.body.labelArr)
        const comptextArr = JSON.parse(req.body.comptextArr)
        const compDataArr = JSON.parse(req.body.compDataArr)

        // const avgRent = JSON.parse(req.body.avgRentArr)
        // const sqrFeet = JSON.parse(req.body.sqrFeetArr)

        const otherImages = JSON.parse(req.body.otherImages)
        const noOfFiles = JSON.parse(req.body.noOfFiles)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }
        let comps = []

        if (req.body.id) {
            comptextArr.forEach((item, idx) => {
                const compsObj = {}
                compsObj['label'] = labelArr[idx] ? labelArr[idx] : undefined
                compsObj['compText'] = item ? item : undefined
                // comptextArr[idx] ? comptextArr[idx] : undefined
                compsObj['compData'] = compDataArr[idx] ? compDataArr[idx] : undefined
                // compsObj['sqrFeet'] = sqrFeet[idx] ? sqrFeet[idx] : undefined
                // compsObj['avgRent'] = item ? item : undefined

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
                compsObj['images'] = [...oldImagesArr, ...newImagesArr]
                comps.push(compsObj)
            })
        } else {
            comptextArr.forEach((item, idx) => {
                const compsObj = {}
                const newImages = [...images]
                compsObj['label'] = labelArr[idx] ? labelArr[idx] : undefined
                compsObj['compText'] = item ? item : undefined
                // comptextArr[idx] ? comptextArr[idx] : undefined
                compsObj['compData'] = compDataArr[idx] ? compDataArr[idx] : undefined
                // compsObj['sqrFeet'] = sqrFeet[idx] ? sqrFeet[idx] : undefined
                // compsObj['avgRent'] = item ? item : undefined

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

                compsObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfNewFiles[idx] : end)

                comps.push(compsObj)
            })
        }
        const newCompsObj = {
            userId: req.userId,
            title: req.body.title,
            isStepCompleted: true,
            comps
        }

        const joiValidation = Joi_Valodation.compsjoi.validate(newCompsObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }

        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateCompsRepo(req.body.id, newCompsObj)
        } else {
            [err, data] = await addCompsRepo(newCompsObj)
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Comps added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getComps = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getCompsRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find comps')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }

}
export const getPlaceDetails = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }
        if (!req.body.placeId) {
            return serverErrorResponse(res, 'Place id is required')
        }
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.placeId}&key=${process.env.GEOCODER_API_KEY}`,
            headers: {}
        };
        const { data } = await axios(config)
        return successResponse(res, data, 'Fetched place details')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}