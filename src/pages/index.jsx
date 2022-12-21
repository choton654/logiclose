import React, { useCallback, useState, useEffect } from 'react';
import {
  Button, FormControlLabel,
  Checkbox, Box, Typography, CircularProgress
} from '@mui/material';
import { useRouter } from "next/router"
import dynamic from "next/dynamic";
import Loader from '../components/Loader';
import { useLoginUserMutation } from "../services/query"
import { getData, storeData } from '../utils/localStorage';
import IsAuthHOC from '../components/IsAuthHOC';

const AuthLayout = dynamic(
  () => import("../components/AuthLayout").then((p) => p.default),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const Login = ({ dimension }) => {

  const router = useRouter()
  const isMobileDevice = useCallback(() => {
    if (dimension.innerWidth < 600) { return true }
  }, [dimension])

  const [login, { isLoading, data, error, isError, isSuccess }] = useLoginUserMutation()

  // const [isLoggedin, setIsloggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setLoginError("Required field is missing")
    } else if (password.trim().length < 6) {
      setLoginError("Password must be 6 charecter long")
    } else {
      const userData = { email, password }
      return login(userData)
    }
  }, [useLoginUserMutation, email, password, loginError]);

  useEffect(() => {
    if (isSuccess) {
      // storeData('uid', data.user._id)
      storeData('token', data.accessToken)
      router.push("/executiveSummary/investmentSummary")
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      setLoginError(error.data?.message)
    }
  }, [isError])

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
          padding: isMobileDevice() ? 2 : 5,
          zIndex: 3
        }}
      >
        <Typography component="h1" variant="h5"
          sx={{ mt: 2, fontFamily: "Poppins", fontWeight: "700" }}>
          Account Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4, width: "90%" }}>
          <Box>
            <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Email address <span style={{ color: "red" }}>*</span>
            </Typography>
            <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
              type={"email"} value={email} onChange={(e) => {
                setLoginError('')
                setEmail(e.target.value)
              }} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle1' sx={{ fontFamily: "Poppins", fontWeight: "600" }}>
              Password <span style={{ color: "red" }}>*</span>
            </Typography>
            <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2'
              type={"password"} value={password} onChange={(e) => {
                setLoginError('')
                setPassword(e.target.value)
              }} />
          </Box>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{ my: 3, fontFamily: "Poppins", fontWeight: "600" }}
          />
          {loginError && <Typography variant='subtitle2' sx={{
            fontFamily: "Poppins", mb: 3,
            fontSize: 12, fontWeight: "600"
          }} color={'red'}>{loginError}</Typography>}

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
                letterSpacing: 1, mb: 2,
                fontFamily: "Poppins", fontWeight: "600"
              }}
            >
              Log In
            </Button>
          }
          <Typography variant='subtitle1' sx={{
            textAlign: "right", fontFamily: "Poppins",
            fontWeight: "600", cursor: "pointer",
            color: "#bdbdbd"
          }} onClick={() => router.push("/forgotPass")}>
            Forget password ?
          </Typography>
          <Typography variant='subtitle1'
            sx={{
              textAlign: "center",
              mt: 4, fontFamily: "Poppins",
              fontWeight: "400",
              color: "#bdbdbd"
            }}>
            Don't have an account?{"    "}
            <strong style={{
              textDecorationLine: "underline",
              fontWeight: "600", cursor: "pointer",
              color: "#424242"
            }} onClick={() => router.push("/signup")}>
              Get started!
            </strong>
          </Typography>
        </Box>
        <Box sx={{
          position: "absolute", height: 60,
          width: 50, top: 0, right: 0,
          zIndex: 1, backgroundColor: "#fff",
          zIndex: 3, borderTopRightRadius: 10
        }} />
        {!isMobileDevice() &&
          <Box sx={{ position: "absolute", top: -50, right: -70, zIndex: 1 }}>
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

export default IsAuthHOC(Login);
