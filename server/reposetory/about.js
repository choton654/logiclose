import About from "../models/about.js"

export const addAboutRepo = async (data) => {
    try {
        const aboutData = await About.create(data)
        if (!aboutData) {
            const errObj = {
                code: 400,
                message: "About data creation error"
            }
            return [errObj, null]
        }
        return [null, aboutData]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateAboutRepo = async (id, data) => {
    try {
        const aboutData = await About.findByIdAndUpdate(id, data, { new: true })
        if (!aboutData) {
            const errObj = {
                code: 400,
                message: "About data update error"
            }
            return [errObj, null]
        }
        return [null, aboutData]
    } catch (error) {
        console.log(error.meaasge);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getAboutRepo = async (userId) => {
    try {
        const aboutData = await About.findOne({ userId })
        if (!aboutData) {
            const errObj = {
                code: 400,
                message: "Can't find about data"
            }
            return [errObj, null]
        }
        return [null, aboutData]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}