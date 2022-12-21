import express from 'express'
import { addAboutData, getAboutData } from '../controllers/aboutController.js'
import { addUserAddress, getUser, forgotPassword, userLogin, userSignup, resetPassword } from '../controllers/userController.js'
import { userValidate } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.post('/signup', userSignup)
router.post('/login', userLogin)
router.post('/about', userValidate, addAboutData)
router.get('/about', userValidate, getAboutData)
router.post('/addLocation', userValidate, addUserAddress)
router.get('/getUser', userValidate, getUser)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)

export default router