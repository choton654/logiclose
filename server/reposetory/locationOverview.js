import LocationSummary from "../models/locationOverview/locationSummary.js";
import Employers from "../models/locationOverview/employer.js";

export const getLocationSummaryRepo = async (userId) => {
    try {
        const locationSummary = await LocationSummary.findOne({ userId })
        if (!locationSummary) {
            const errObj = {
                code: 400,
                message: "Can't find location summary"
            }
            return [errObj, null]
        }
        return [null, locationSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addLocationSummaryRepo = async (data) => {
    try {
        const locationSummary = await LocationSummary.create(data)
        if (!locationSummary) {
            const errObj = {
                code: 400,
                message: "Location summary creation error"
            }
            return [errObj, null]
        }
        return [null, locationSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateLocationSummaryRepo = async (id, data) => {
    try {
        const locationSummary = await LocationSummary.findByIdAndUpdate(id, data, { new: true })
        if (!locationSummary) {
            const errObj = {
                code: 400,
                message: "Location summary update error"
            }
            return [errObj, null]
        }
        return [null, locationSummary]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addEmployersRepo = async (data) => {
    try {
        const employers = await Employers.create(data)
        if (!employers) {
            const errObj = {
                code: 400,
                message: "Employers creation error"
            }
            return [errObj, null]
        }
        return [null, employers]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getEmployersRepo = async (userId) => {
    try {
        const employers = await Employers.findOne({ userId })
        if (!employers) {
            const errObj = {
                code: 400,
                message: "Can't find employers data"
            }
            return [errObj, null]
        }
        return [null, employers]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const updateEmployersRepo = async (id, data) => {
    try {
        const employers = await Employers.findByIdAndUpdate(id, data, { new: true })
        if (!employers) {
            const errObj = {
                code: 400,
                message: "Employers update error"
            }
            return [errObj, null]
        }
        return [null, employers]
    } catch (error) {
        console.log(error.message);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}