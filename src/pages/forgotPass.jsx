import React, { useCallback, useState, useMemo } from 'react';
import {
    Button, Box, Typography, CircularProgress,
} from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/router';
import dynamic from "next/dynamic"
import Loader from '../components/Loader';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { BASE_URL } from '../utils/api';

const AuthLayout = dynamic(
    () => import("../components/AuthLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const ForgotPass = ({ dimension }) => {

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const emailFilter = useMemo(() => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, [])
    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email.trim() === '' || !emailFilter.test(email)) {
            setEmailError('Please enter email')
        } else {
            try {
                setIsLoading(true)
                const { data } = await axios.post(`${BASE_URL}/api/user/forgotPassword`, { email })
                setIsLoading(false)
                setSuccessMsg(`An email has been sent to ${email}`)
            } catch (error) {
                console.log('error', error.response.data.message);
                setIsLoading(false)
                if (error.response.data.message !== undefined) {
                    setEmailError(error.response.data.message)
                } else {
                    setEmailError('Reset pass error')
                }
            }
        }
    }

    return (
        <AuthLayout dimension={dimension} isPass>
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
                <Typography component="h1" variant="h5"
                    sx={{ mt: 2, fontFamily: "Poppins", fontWeight: "700", textAlign: "center" }}>
                    Forgot your password?
                </Typography>
                <Typography component="h1" variant='subtitle1'
                    sx={{
                        mt: 2, fontFamily: "Poppins", fontWeight: "500",
                        textAlign: "center", color: "#bdbdbd"
                    }}>
                    Enter your email and we'll send you a reset
                </Typography>
                <Typography component="h1" variant='subtitle1'
                    sx={{
                        fontFamily: "Poppins", fontWeight: "500",
                        textAlign: "center", color: "#bdbdbd"
                    }}>
                    link.
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 8, width: "90%" }}>
                    <Box>
                        <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
                            Email address
                        </Typography>
                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError('')
                                setSuccessMsg('')
                            }}
                            type={"email"} />
                        {emailError && <Typography variant='subtitle2' sx={{
                            fontFamily: "Poppins", mt: 2,
                            fontSize: 12, fontWeight: "600"
                        }} color={'red'}>{emailError}</Typography>}
                    </Box>
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
                            Send reset link
                        </Button>
                    }
                    <Typography variant='subtitle2'
                        sx={{
                            textAlign: "center",
                            mt: 1, fontFamily: "Poppins",
                            fontWeight: "400",
                            color: "#bdbdbd",
                            textAlign: "left"
                        }}>
                        I can't recover my account using this page <ArrowRightAltIcon fontSize='small' />
                    </Typography>
                    {successMsg && <Typography variant='subtitle2' sx={{
                        fontFamily: "Poppins", mt: 2,
                        fontSize: 12, fontWeight: "600"
                    }} color={'green'}>{successMsg}</Typography>}
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

export default ForgotPass;
