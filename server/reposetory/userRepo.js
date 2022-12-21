import User from "../models/user.js"
import { handleMongoError } from "../utils/error.js"

export const signupRepo = async (userData) => {
    try {
        const user = await User.create(userData)
        user.password = undefined
        return [null, user]
    } catch (error) {
        console.log('user creation error', error);
        const mongoError = handleMongoError(error)
        const errObj = {
            code: 400,
            message: mongoError
        }
        return [errObj, null]
    }
}

export const loginRepo = async (email) => {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            const errObj = {
                code: 404,
                message: "Can't find user with this email"
            }
            return [errObj, null]
        }
        return [null, user]
    } catch (error) {
        console.log('login error', error);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const resetPassRepo = async (email, password) => {
    try {
        const user = await User.findOneAndUpdate({ email }, { password }, { new: true })
        if (!user) {
            const errObj = {
                code: 404,
                message: "Reset password failure"
            }
            return [errObj, null]
        }
        return [null, user]
    } catch (error) {
        console.log('Reset password error', error);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const addAddressRepo = async (id, longitude, latitude, address) => {
    try {
        const user = await User.findByIdAndUpdate(
            id,
            {
                location: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    formattedAddress: address,
                },
            },
            { new: true }
        )

        if (!user) {
            const errObj = {
                code: 404,
                message: "Location update failure"
            }
            return [errObj, null]
        }
        return [null, user]
    } catch (error) {
        console.log('location update error', error);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}

export const getUserRepo = async (id) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            const errObj = {
                code: 404,
                message: "Can't find user"
            }
            return [errObj, null]
        }
        return [null, user]
    } catch (error) {
        console.log('login error', error);
        const errObj = {
            code: 400,
            message: error.message
        }
        return [errObj, null]
    }
}