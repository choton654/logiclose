import React, { useCallback, useEffect } from 'react';
import {
    Button, Box, Typography, CircularProgress
} from '@mui/material';
import dynamic from "next/dynamic"
import Loader from '../components/Loader';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken'
import { useState } from 'react';
import { USER_SIGNING_KEY } from '../utils/keys';
import { BASE_URL } from '../utils/api';
import axios from 'axios';
import Link from 'next/link';

const AuthLayout = dynamic(
    () => import("../components/AuthLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const ResetPass = ({ dimension }) => {

    const router = useRouter()
    const [verifiedEmail, setVerifiedEmail] = useState('')
    const [password, setPassword] = useState('')
    const [retypePass, setRetypePass] = useState('')
    const [passError, setPassError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [validLink, setValidLink] = useState(false)

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    useEffect(() => {
        if (router.query.email !== undefined) {
            const verifiedEmail = jwt.verify(router.query.email, USER_SIGNING_KEY)
            setVerifiedEmail(verifiedEmail)
            const currentTime = Date.now()
            const verifiedTime = jwt.verify(router.query.time, USER_SIGNING_KEY)
            const timeDiff = ((currentTime - verifiedTime) / 60000).toFixed(2)
            if (timeDiff <= 5) {
                setValidLink(true)
            }
        }
    }, [router.query])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ((password.trim() === '' || retypePass.trim() === '') ||
            password.trim() !== retypePass.trim()) {
            setPassError('Please check passwords')
        } else if (!verifiedEmail) {
            setPassError('You can not access this page directly')
        } else if (validLink) {
            try {
                setIsLoading(true)
                const { data } = await axios.post(`${BASE_URL}/api/user/resetPassword`, { email: verifiedEmail, password })
                setIsLoading(false)
                setVerifiedEmail('')
                setSuccessMsg(`Your password has been reset. Click here to login`)
            } catch (error) {
                console.log('error', error.response.data.message);
                setIsLoading(false)
                if (error.response.data.message !== undefined) {
                    setPassError(error.response.data.message)
                } else {
                    setPassError('Reset pass error')
                }
            }
        }
    }


    if (!validLink) {
        return (
            <AuthLayout dimension={dimension} isPass resetPass>
                <Box className='h-full flex justify-center items-center'>
                    <Typography component="h1" variant={isMobileDevice() ? "h6" : "h5"}
                        sx={{ mt: 2, fontFamily: "Poppins", fontWeight: "700", textAlign: "center" }}>
                        The link is not valid
                    </Typography>
                </Box>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout dimension={dimension} isPass resetPass>
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
                    padding: isMobileDevice() ? 2 : 5,
                    zIndex: 3
                }}
            >
                <Typography component="h1" variant={isMobileDevice() ? "h6" : "h5"}
                    sx={{ mt: 2, fontFamily: "Poppins", fontWeight: "700", textAlign: "center" }}>
                    Set New Password
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 8, width: "90%" }}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            New Password
                        </Typography>
                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            type={"password"} onChange={(e) => {
                                setPassError('')
                                setSuccessMsg('')
                                setPassword(e.target.value)
                            }} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Re-type Password
                        </Typography>
                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            type={"password"} onChange={(e) => {
                                setPassError('')
                                setSuccessMsg('')
                                setRetypePass(e.target.value)
                            }} />
                    </Box>
                    {passError && <Typography variant='subtitle2' sx={{
                        fontFamily: "Poppins", mt: 2,
                        fontSize: 12, fontWeight: "600"
                    }} color={'red'}>{passError}</Typography>}
                    {isLoading ?
                        <Box sx={{
                            display: "flex", mt: 6, mb: 2, justifyContent: "center",
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
                                letterSpacing: 1, mt: 6, mb: 2,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}
                        >
                            Change password
                        </Button>
                    }
                    {successMsg &&
                        <Link href={`${BASE_URL}`}>
                            <Typography variant='subtitle2' sx={{
                                fontFamily: "Poppins", mt: 2,
                                fontSize: 12, fontWeight: "600",
                                textDecorationLine: 'underline',
                                cursor: 'pointer'
                            }} color={'green'}>{successMsg}
                            </Typography>
                        </Link>
                    }
                </Box>
                <Box sx={{
                    position: "absolute", height: 100,
                    width: 50, top: 0, right: 0,
                    zIndex: 1, backgroundColor: "#fff",
                    zIndex: 3, borderTopRightRadius: 10
                }} />
                {!isMobileDevice() &&
                    <Box sx={{ position: "absolute", top: -20, right: -65, zIndex: 1 }}>
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

export default ResetPass;
