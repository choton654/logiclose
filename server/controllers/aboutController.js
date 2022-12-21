import Joi_Valodation from "../joi/api/index.js"
import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import { addAboutRepo, getAboutRepo, updateAboutRepo } from "../reposetory/about.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"

export const addAboutData = async (req, res) => {
    try {

        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        await handleMulter(req, res)
        const names = JSON.parse(req.body.names)
        const emails = JSON.parse(req.body.emails)
        const contactsArr = JSON.parse(req.body.contacts)
        const otherImages = JSON.parse(req.body.otherImages)
        const noOfFiles = JSON.parse(req.body.noOfFiles)
        const noOfNewFiles = JSON.parse(req.body.noOfNewFiles)

        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }

        let contacts = []

        if (req.body.id) {
            names.forEach((item, idx) => {
                const aboutObj = {}
                // const newImages = [...otherImages, ...images]
                aboutObj['name'] = item
                aboutObj['email'] = emails[idx]
                aboutObj['contact'] = contactsArr[idx]
                // aboutObj['image'] = newImages[idx]

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
                aboutObj['images'] = [...oldImagesArr, ...newImagesArr]
                contacts.push(aboutObj)
            })
        } else {
            names.forEach((item, idx) => {
                const aboutObj = {}
                const newImages = [...images]
                aboutObj['name'] = item
                aboutObj['email'] = emails[idx]
                aboutObj['contact'] = contactsArr[idx]

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
                aboutObj['images'] = newImages.slice(idx === 0 ? 0 : start, idx === 0 ? noOfNewFiles[idx] : end)
                contacts.push(aboutObj)
            })
        }
        const newAboutObj = {
            userId: req.userId,
            about: req.body.about,
            contacts,
            isStepCompleted: true
        }

        const joiValidation = Joi_Valodation.aboutJoi.validate(newAboutObj)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, "Fields can't be empty");
        }
        let [err, data] = [null, null]
        if (req.body.id) {
            [err, data] = await updateAboutRepo(req.body.id, newAboutObj)
        } else {
            [err, data] = await addAboutRepo(newAboutObj)
        }
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'About data added')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const getAboutData = async (req, res) => {
    try {
        if (!req.userId) {
            return serverErrorResponse(res, 'User is not authorized')
        }

        const [err, data] = await getAboutRepo(req.userId)

        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'Find about data')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}