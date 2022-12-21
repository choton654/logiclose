import React, { useCallback, useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import dynamic from "next/dynamic"
import Loader from '../components/Loader';
import { useSignUpUserMutation } from "../services/query"
import { getData } from '../utils/localStorage';
import IsAuthHOC from '../components/IsAuthHOC';

const AuthLayout = dynamic(
    () => import("../components/AuthLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const Signup = ({ dimension }) => {

    const router = useRouter()
    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])
    const [signUp, { isLoading, data, error, isError, isSuccess }] = useSignUpUserMutation()
    const [isLoggedin, setIsloggedIn] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [retypePass, setRetypePass] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passError, setPasswordError] = useState('')
    const [duplicateError, setDuplicateError] = useState('')

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (email.trim() === '' || name.trim() === '' || password.trim() === '' || retypePass.trim() === '') {
            setFieldError("Required field is missing")
        } else if (password.trim().length < 6) {
            setFieldError("Password must be 6 charecter long")
        } else if (password.trim() !== retypePass.trim()) {
            setFieldError("Please retype your Password")
        } else {
            const userData = { name, email, password }
            return signUp(userData)
        }
    }, [useSignUpUserMutation, name, email, password, retypePass, fieldError]);

    useEffect(() => {
        if (isSuccess) {
            router.push('/')
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            if (error.data.message.includes("name")) {
                setNameError(error.data.message)
            } else if (error.data.message.includes("email")) {
                setEmailError(error.data.message)
            } else if (error.data.message.includes("password")) {
                setPasswordError(error.data.message)
            } else if (error.data.message.includes("is already exists...")) {
                setDuplicateError(error.data.message)
            }
        }
    }, [isError])

    useEffect(() => {
        if (getData('token') && getData('uid')) {
            router.push("/executiveSummary/investmentSummary")
            setIsloggedIn(true)
        } else {
            setIsloggedIn(true)
        }
    }, [])

    if (!isLoggedin) { return <Loader /> }

    return (
        <AuthLayout dimension={dimension}>
            <Box
                sx={{
                    position: "relative",
                    my: isMobileDevice() ? 3 : 8,
                    mx: 'auto',
                    width: isMobileDevice() ? "80%" : "70%",
                    height: isMobileDevice() ? '90%' : '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 8px 0 #eeeeee, 0 6px 20px 0 #eeeeee',
                    borderRadius: 3,
                    padding: isMobileDevice() ? 2 : 5
                }}
            >
                <Typography component="h1" variant="h5"
                    sx={{ fontFamily: "Poppins", fontWeight: "700" }}>
                    Registration
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: "90%" }}>
                    <Box>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Name <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <input required className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            value={name}
                            onChange={(e) => {
                                setFieldError('')
                                setEmailError('')
                                setDuplicateError('')
                                setPasswordError('')
                                setNameError('')
                                setName(e.target.value)
                            }} />
                        {isError && nameError &&
                            <Typography variant='subtitle2' sx={{ fontSize: 12, color: "red", fontFamily: "Poppins" }}>
                                {error.data.message}
                            </Typography>
                        }
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Email address <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <input required className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            type={"email"} value={email}
                            onChange={(e) => {
                                setFieldError('')
                                setEmailError('')
                                setDuplicateError('')
                                setPasswordError('')
                                setNameError('')
                                setEmail(e.target.value)
                            }} />
                        {isError && emailError &&
                            <Typography variant='subtitle2' sx={{ fontSize: 12, color: "red", fontFamily: "Poppins" }}>
                                {error.data.message}
                            </Typography>
                        }
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Password <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <input required className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            type={"password"} value={password}
                            onChange={(e) => {
                                setFieldError('')
                                setEmailError('')
                                setDuplicateError('')
                                setPasswordError('')
                                setNameError('')
                                setPassword(e.target.value)
                            }} />
                        {isError && passError &&
                            <Typography variant='subtitle2' sx={{ fontSize: 12, color: "red", fontFamily: "Poppins" }}>
                                {error.data.message}
                            </Typography>
                        }
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Retype Password <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <input required className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            type={"password"} value={retypePass}
                            onChange={(e) => {
                                setFieldError('')
                                setEmailError('')
                                setDuplicateError('')
                                setPasswordError('')
                                setNameError('')
                                setRetypePass(e.target.value)
                            }} />
                    </Box>
                    {fieldError && <Typography variant='subtitle2' sx={{
                        fontFamily: "Poppins", mt: 2,
                        fontSize: 12, fontWeight: "600"
                    }} color={'red'}>{fieldError}</Typography>}
                    {isError && duplicateError &&
                        <Typography variant='subtitle2' sx={{
                            fontFamily: "Poppins", mt: 2, color: "red",
                            fontSize: 12, fontWeight: "600"
                        }}>
                            {error.data.message}
                        </Typography>
                    }
                    {isLoading ?
                        <Box sx={{
                            my: 3, display: "flex",
                            width: "100%", justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <CircularProgress size={30} />
                        </Box>
                        :
                        <Button
                            className='bg-[#f97316]'
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                letterSpacing: 1, my: 3,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}
                        >
                            Sign Up
                        </Button>
                    }
                    <Typography variant='subtitle1' sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "400" }}>
                        If you have an account? {"    "}
                        <strong style={{
                            textDecorationLine: "underline",
                            fontWeight: "600", cursor: "pointer"
                        }} onClick={() => router.push("/")}>
                            Login
                        </strong>
                    </Typography>
                </Box>
                <Box sx={{
                    position: "absolute", height: 100,
                    width: 50, top: 0, right: 0, backgroundColor: "#fff",
                    zIndex: 3, borderTopRightRadius: 10
                }} />
                {!isMobileDevice() &&
                    <Box sx={{ position: "absolute", top: -20, right: -70, zIndex: 1 }}>
                        <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="56" cy="56" r="54" stroke="#E6F4F1" strokeWidth="4" />
                        </svg>
                        <svg style={{ marginLeft: "auto", marginTop: 5 }} width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16.5" cy="16.5" r="14.5" stroke="#E6F4F1" strokeWidth="4" />
                        </svg>
                    </Box>
                }
            </Box>
        </AuthLayout>
    );
}

export default IsAuthHOC(Signup, "/signup")