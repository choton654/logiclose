import Joi_Valodation from "../joi/api/index.js"
import { signupRepo, loginRepo, addAddressRepo, getUserRepo, resetPassRepo } from "../reposetory/userRepo.js";
import {
    badRequestResponse, notFoundResponse,
    serverErrorResponse, successResponse, handle304
} from "../utils/response.js"
import bcrypt from 'bcrypt'
import { signToken } from "../utils/jwt.js";
import geocoder from "../utils/geocoder.js";
import sgMail from "@sendgrid/mail"
import { USER_SIGNING_KEY } from "../utils/config.js"
import jwt from 'jsonwebtoken'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


export const userSignup = async (req, res) => {
    try {
        const joiValidation = Joi_Valodation.createUserJoi.validate(req.body)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashPassword
        const [err, data] = await signupRepo(req.body)
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, data, 'User successfully registered')
    } catch (error) {
        console.log(error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const userLogin = async (req, res) => {
    try {
        const joiValidation = Joi_Valodation.loginUserJoi.validate(req.body)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        const [err, user] = await loginRepo(req.body.email)
        if (err) {
            if (err.code === 404) {
                return notFoundResponse(res, err.message)
            }
            return serverErrorResponse(res, err.message)
        }
        const checkPassword = await bcrypt.compare(req.body.password, user.password)
        if (!checkPassword) {
            return serverErrorResponse(res, "Password doesn't match")
        }
        const token = signToken(user._id, req.query.role)
        user.password = undefined
        const data = { user, accessToken: token }
        return successResponse(res, data, 'User successfully logged in')
    } catch (error) {
        console.log(error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}

export const addUserAddress = async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        if (!req.userId || req.userId === undefined) {
            return serverErrorResponse(res, 'Location can be updated for logged in user');
        }

        if (!longitude || !latitude) {
            return serverErrorResponse(res, 'Longitude and latitude is needed to update user address');
        }

        const loc = await geocoder.reverse({
            lat: latitude,
            lon: longitude,
        });

        let address = loc[0].formattedAddress

        const [err, user] = await addAddressRepo(req.userId, longitude, latitude, address)
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        const data = {
            landmark: loc[0].extra.neighborhood,
            locality: loc[0].formattedAddress,
            userId: user._id
        }
        return successResponse(res, data, 'Location has been added')

    } catch (error) {
        console.error('location error', error);
        return serverErrorResponse(res, error.message);
    }
}

export const getUser = async (req, res) => {
    try {
        if (!req.userId || req.userId === undefined) {
            return serverErrorResponse(res, 'User not authorized');
        }
        const [err, user] = await getUserRepo(req.userId)
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, user, 'User found')
    } catch (error) {
        console.error('user found error', error);
        return serverErrorResponse(res, error.message);
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const joiValidation = Joi_Valodation.loginUserJoi.validate(req.body)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        const [err, user] = await loginRepo(req.body.email)
        if (err) {
            if (err.code === 404) {
                return notFoundResponse(res, err.message)
            }
            return serverErrorResponse(res, err.message)
        }

        const encryptedEmail = jwt.sign(req.body.email, USER_SIGNING_KEY)
        const encryptedTime = jwt.sign(Date.now(), USER_SIGNING_KEY)
        const msg = {
            // to: 'subhajit688@gmail.com',
            to: req.body.email,
            from: process.env.SENDER_EMAIL,
            subject: 'Re-set password',
            text: 'Click the link below to reset your password',
            html: `<div>
                    <strong>Click the link below to reset your password</strong>
                    <a href='${process.env.DOMAIN}/resetPass?email=${encryptedEmail}&time=${encryptedTime}'>Change password</a>
                    </div>`
        };
        const resEmail = await sgMail.send(msg)
        console.log(resEmail)
        return successResponse(res, null, 'Email send successful')
    } catch (error) {
        console.error('reset password error', error);
        return serverErrorResponse(res, error.message);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const joiValidation = Joi_Valodation.loginUserJoi.validate(req.body)
        if (joiValidation.error) {
            console.log("Joi validation error");
            return badRequestResponse(res, joiValidation.error.details[0].message);
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashPassword
        const [err, user] = await resetPassRepo(req.body.email, req.body.password)
        if (err) {
            return serverErrorResponse(res, err.message)
        }
        return successResponse(res, user, 'Password successfuly updated')
    } catch (error) {
        console.error('reset password error', error);
        return serverErrorResponse(res, error.message);
    }
}