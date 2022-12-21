import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from "next/image"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from 'react-redux'
import {
    Button, Box, ThemeProvider, Grid, createTheme,
    Stepper, Step, StepLabel, Paper, CssBaseline,
    StepConnector, Typography, Avatar, Menu, MenuItem,
    Fade
} from '@mui/material'
import { logiCloseSlice, logicloseState } from "../features/logicloseSlice"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CheckIcon from '@mui/icons-material/Check'
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import logo from "../../public/assets/logo.png"
import { clearData } from '../utils/localStorage'
import CircularProgressWithLabel from './CircularLoader'
import Steps from "../components/Steps"

const theme = createTheme()

const steps = [
    {
        label: 'Executive Summary',
        route: '/executiveSummary/investmentSummary'
    },
    {
        label: 'Property Summary',
        route: '/propertyDescription/propertySummary'
    },
    {
        label: 'Location Overview',
        route: '/locationOverView/locationSummary'
    },
    {
        label: 'Financial Summary',
        route: '/financialSummary/sourceFund'
    },
    {
        label: 'Exit Scenarios',
        route: '/exitScenarios/refinanceScenario'
    },
    {
        label: 'About ',
        route: '/about'
    },
];

const VerticalStepper = ({
    dimension, insideSteps, stepCount, logiCloseStep }) => {

    const router = useRouter()

    return (
        <Box>
            <Stepper activeStep={logiCloseStep} orientation="vertical"
                connector={<StepConnector style={{ marginLeft: 12 }}
                    sx={{ width: 3, height: 45, backgroundColor: "#E7EDF1" }} />}>
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel className='hover:scale-125 duration-200'
                            onClick={() => {
                                if (step.route) {
                                    router.push(step.route)
                                }
                            }} StepIconComponent={({ active, completed, error }) => {
                                return <Box
                                    sx={{
                                        display: "flex", height: 30, width: 30,
                                        backgroundColor: completed ? "#469BD3" : "#fff",
                                        justifyContent: "center", alignItems: "center",
                                        borderRadius: 10, cursor: "pointer"
                                    }}>
                                    {completed ?
                                        <CheckIcon sx={{ color: "#fff" }} />
                                        :
                                        <CircularProgressbar
                                            value={(stepCount + 1) / insideSteps.length}
                                            minValue={0}
                                            maxValue={1}
                                            text={`${index + 1}`}
                                            background={true}
                                            backgroundPadding={2}
                                            circleRatio={1}
                                            counterClockwise={true}
                                            styles={buildStyles({
                                                // Rotation of path and trail, in number of turns (0-1)
                                                rotation: 0,
                                                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                strokeLinecap: 'butt',
                                                // Text size
                                                textSize: 40,
                                                // How long animation takes to go from one percentage to another, in seconds
                                                pathTransitionDuration: 0.5,
                                                // Can specify path transition in more detail, or remove it entirely
                                                pathTransition: 'none',
                                                // Colors
                                                pathColor: `#EBEBEB`,
                                                textColor: active ? "#fff" : "#989898",
                                                trailColor: active ? 'rgba(62, 152, 199, 1)' : "#EBEBEB",
                                                backgroundColor: active ? "#469BD3" : "#fff",
                                            })}
                                        />
                                    }
                                </Box>
                            }}>
                            {dimension && dimension.innerWidth > 900 &&
                                <Typography sx={{ cursor: 'pointer', fontSize: 14, fontFamily: "Poppins", fontWeight: "500" }}>
                                    {step.label}
                                </Typography>
                            }
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

const LogiCLoseLayout = ({
    dimension, children, title, layoutHeight, isLoading,
    insideSteps, stepCount, handleSubmit, goBackRoute,
    setSaveContent }) => {

    const dispatch = useDispatch()
    const logiCloseStep = useSelector(logicloseState).logiCloseStep
    const { decrement, setlogiCloseStep } = logiCloseSlice.actions
    const router = useRouter()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const goBack = useCallback(() => {
        if (stepCount === 0) {
            dispatch(decrement())
        }
        if (goBackRoute !== undefined) {
            router.push(goBackRoute)
        } else {
            router.back()
        }
    }, [stepCount])

    const goForward = useCallback(() => {
        if (stepCount === insideSteps.length - 1) {
            setSaveContent !== undefined && setSaveContent(false)
            handleSubmit()
        }
    }, [stepCount, insideSteps, handleSubmit])

    const logOut = useCallback(() => {
        clearData()
        router.push('/')
    }, [stepCount])

    useEffect(() => {
        if (router.pathname.includes('executiveSummary')) {
            dispatch(setlogiCloseStep(0))
        } else if (router.pathname.includes('propertyDescription')) {
            dispatch(setlogiCloseStep(1))
        } else if (router.pathname.includes('locationOverView')) {
            dispatch(setlogiCloseStep(2))
        } else if (router.pathname.includes('financialSummary')) {
            dispatch(setlogiCloseStep(3))
        } else if (router.pathname.includes('exitScenarios')) {
            dispatch(setlogiCloseStep(4))
        } else if (router.pathname === '/about') {
            dispatch(setlogiCloseStep(5))
        }
    }, [router.pathname])

    return (
        <Box>
            <Head>
                <title>LOGICLOSE</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ background: "#F0F7FC", flex: 1 }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={0}
                        sm={2}
                        md={3}
                        sx={{
                            position: "relative",
                            backgroundColor: "#F6FBFF",
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flex: 1
                        }}
                        component={Paper}
                        elevation={6} square
                    >
                        {dimension && dimension.innerWidth > 600 &&
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box
                                    // onClick={() => router.push("/webView/executiveSummary")}
                                    sx={{ width: "50%", height: 70, ml: 4, mt: 3, cursor: "pointer" }}>
                                    <Image
                                        src={logo}
                                        layout="responsive"
                                    />
                                </Box>
                                <Box sx={{
                                    width: "50%",
                                    position: "absolute",
                                    left: dimension && dimension.innerWidth > 900 ? '15%' : '30%',
                                    top: 140, zIndex: 3
                                }}>
                                    <VerticalStepper
                                        dimension={dimension}
                                        insideSteps={insideSteps}
                                        stepCount={stepCount}
                                        logiCloseStep={logiCloseStep} />
                                </Box>
                                <svg
                                    style={{ position: "absolute", bottom: 0 }}
                                    width="100%" height="35%" viewBox="0 0 407 231" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M476.082 284.157C467.407 270.058 454.39 260.297 439.203 253.789C435.948 194.138 410.998 137.741 367.606 96.5267C323.132 53.1439 263.47 28.1988 200.553 28.1988C185.366 28.1988 169.095 29.2833 153.908 32.5371C147.399 23.8605 138.722 16.2685 130.044 10.8457C118.111 4.33813 105.094 0 90.9917 0C69.2966 0 49.7707 8.67665 34.5839 22.7759C20.4822 37.9599 11.8038 57.4822 11.8038 78.089C11.8038 88.9347 13.9734 99.7805 18.3126 109.541C-15.3151 148.586 -34.8409 196.307 -39.18 247.282C-43.519 298.257 -30.5018 349.232 -3.38271 392.614C-12.0608 405.629 -16.3999 420.813 -16.3999 435.997C-16.3999 452.265 -10.976 467.451 -2.29791 480.466C7.46505 493.477 20.4822 503.241 35.6689 508.664C44.3469 511.916 53.0253 513 62.7878 513C69.2966 513 76.89 511.916 83.3983 510.832C96.4159 507.58 108.348 499.985 118.111 491.309C168.01 508.664 222.249 509.748 272.148 494.565C322.047 478.294 365.438 446.843 395.811 403.46C400.148 404.544 404.49 404.544 408.827 404.544C408.827 404.544 408.827 404.544 409.915 404.544C428.353 404.544 446.794 398.037 460.898 386.107C474.999 374.176 484.761 356.823 486.932 338.386C490.186 318.863 485.844 299.341 476.082 284.157ZM137.637 452.265C138.722 446.843 139.806 440.335 139.806 434.913C139.806 414.305 131.128 394.783 117.026 379.599C101.84 364.415 82.3137 356.823 61.7032 356.823C49.7707 356.823 38.9231 358.993 29.1602 364.415C9.63464 330.794 0.956272 290.665 3.12587 251.62C6.38005 212.576 21.5668 174.616 45.4319 144.248C55.1945 150.755 66.0424 155.093 77.9746 156.178C93.1613 158.347 108.348 156.178 121.365 149.671C135.467 143.163 146.315 133.402 154.993 121.472C162.586 107.372 166.925 93.2729 166.925 78.089C166.925 75.9198 166.925 74.8353 166.925 72.6661C177.773 70.497 187.536 70.497 199.468 70.497C250.452 70.497 299.267 90.0192 335.064 124.725C369.777 157.262 390.386 201.73 394.727 248.366C381.711 250.535 369.777 255.958 360.014 264.635C357.844 266.804 355.675 267.889 353.505 270.058L352.42 271.143C343.742 279.819 337.234 291.749 333.979 303.68C329.64 319.948 329.64 336.217 335.064 351.401C339.403 363.331 346.997 374.176 355.675 382.853C330.725 415.39 297.097 440.335 258.046 452.265C218.994 465.279 176.688 465.279 137.637 452.265ZM125.704 85.681C124.62 92.1886 121.365 98.6958 115.941 104.119C110.518 109.541 105.094 112.795 97.5005 113.88C90.9917 114.964 83.3983 114.964 76.89 111.711C70.3812 108.457 64.9574 104.119 60.6186 97.6114C57.364 92.1886 55.1945 85.681 55.1945 78.089C55.1945 73.7507 56.2794 68.3278 57.364 65.0741C59.5336 60.7359 61.7032 56.3976 64.9574 53.1439C68.212 49.8902 72.5508 47.721 76.89 45.5519C81.2291 43.3827 85.5679 43.3827 89.9071 43.3827C97.5005 43.3827 104.009 45.5519 110.518 49.8902C115.941 54.2285 121.365 59.6513 123.535 66.1587C125.704 71.5816 126.789 78.089 125.704 85.681ZM30.2452 421.898C32.4147 417.559 34.5839 413.221 37.8385 409.967C41.0927 406.714 45.4319 404.544 49.7707 402.375C54.1099 400.206 58.449 400.206 62.7878 400.206H63.8728C69.2966 400.206 73.6358 401.291 77.9746 402.375C82.3137 404.544 86.6529 406.714 89.9071 409.967C93.1613 413.221 95.3309 417.559 97.5005 421.898C99.6701 426.236 99.6701 430.574 99.6701 435.997C99.6701 445.758 95.3309 454.435 88.8225 460.943C82.3138 467.451 73.6358 471.787 63.8728 471.787C59.5336 471.787 54.1099 470.703 49.7707 469.619C45.4319 467.451 41.0927 465.279 37.8385 462.027C34.5839 458.771 31.3298 454.435 30.2452 450.096C28.0756 445.758 26.9906 441.42 26.9906 435.997C26.9906 430.574 28.0756 426.236 30.2452 421.898ZM376.286 311.272C378.456 306.933 380.623 302.595 383.877 299.341C387.131 296.087 391.473 293.918 395.811 291.749C400.148 289.58 404.49 289.58 408.827 289.58C408.827 289.58 408.827 289.58 409.915 289.58H414.252C421.844 290.665 429.44 293.918 434.861 299.341C441.369 305.849 445.711 314.525 445.711 324.286C445.711 334.047 442.457 342.724 434.861 349.232C428.353 355.739 418.59 360.077 409.915 360.077C400.148 358.993 391.473 355.739 384.965 349.232C378.456 342.724 374.115 334.047 374.115 325.371C373.031 321.033 374.115 315.61 376.286 311.272Z" fill="#E7F5FF" />
                                </svg>
                            </Box>
                        }
                    </Grid>
                    <Grid item xs={12} sm={10} md={9} sx={{
                        display: "flex", flexDirection: "column",
                        px: 3, py: 3, backgroundColor: "#F0F7FC",
                        height: layoutHeight,
                    }}>
                        <Paper sx={{
                            display: "flex", justifyContent: "space-between",
                            width: "100%", height: 50, px: 2, py: 1,
                            boxShadow: "0 0 20px 5px #e2e8f0",
                            alignItems: "center"
                        }}>
                            <Typography variant='subtitle2' sx={{
                                color: "#3E4A3D", letterSpacing: '0.02em',
                                fontWeight: "500", fontFamily: "Poppins",
                                fontSize: 20
                            }}>{title}
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Button
                                    className='bg-[#469BD3]'
                                    type="submit"
                                    variant="contained"
                                    size='small'
                                    sx={{
                                        marginLeft: "auto",
                                        letterSpacing: 1, mr: 2,
                                        fontFamily: "Poppins", fontWeight: "600"
                                    }}
                                    onClick={() => {
                                        switch (title) {
                                            case 'Executive Summary':
                                                router.push('/webView/executiveSummary')
                                                break;
                                            case 'Property Summary':
                                                router.push('/webView/propertySummary')
                                                break;
                                            case 'Location Overview':
                                                router.push('/webView/locationOverView')
                                                break;
                                            case 'Financial Summary':
                                                router.push('/webView/financialSummary')
                                                break;
                                            case 'Exit Scenarios':
                                                router.push('/webView/exitScenarios')
                                                break;
                                            case 'About':
                                                router.push('/webView/about')
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                >
                                    Preview
                                </Button>
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: 'pointer' }}>
                                    <Avatar
                                        alt="Remy Sharp"
                                        src="https://images.unsplash.com/photo-1660228321829-5f90c6d94ac5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDd8dG93SlpGc2twR2d8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
                                        sx={{ width: 35, height: 35, my: 2 }}
                                        onClick={handleClick}
                                    />
                                </Box>
                            </Box>

                            <Menu
                                id="fade-menu"
                                MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                            >
                                {/* <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/executiveSummary')
                                        handleClose()
                                    }}>Executive Summary</MenuItem>
                                <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/propertySummary')
                                        handleClose()
                                    }}>Property Summary</MenuItem>
                                <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/locationOverView')
                                        handleClose()
                                    }}>Location Overview</MenuItem>
                                <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/financialSummary')
                                        handleClose()
                                    }}>Financial Summary</MenuItem>
                                <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/exitScenarios')
                                        handleClose()
                                    }}>Exit Scenarios</MenuItem>
                                <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                    onClick={() => {
                                        router.push('/webView/about')
                                        handleClose()
                                    }}>About</MenuItem> */}
                                <MenuItem
                                    onClick={logOut}
                                    className='bg-[#469BD3] text-[#fff] hover:text-[#469BD3]'>
                                    {/* <Button
                                        className='bg-[#469BD3]'
                                        type="submit"
                                        variant="outlined"
                                        sx={{
                                            height: 25,
                                            letterSpacing: 1, width: 100,
                                            fontFamily: "Poppins", fontWeight: "600",
                                            fontSize: 12
                                        }}
                                        onClick={logOut}
                                    >
                                    </Button> */}
                                    <Typography sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                                        className='hover:text-[#469BD3]'>
                                        Log out
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Paper>
                        {dimension && router.pathname !== "/about" &&
                            <Steps stepCount={stepCount} insideSteps={insideSteps}
                                dimension={dimension} />
                        }
                        {children}
                        <Box sx={{ mt: 7, display: "flex", justifyContent: "space-between" }}>
                            {router.pathname !== "/executiveSummary/investmentSummary" &&
                                <Box sx={{
                                    display: "flex", width: 140, height: 40,
                                    alignItems: "center", cursor: "pointer",
                                    pl: 1
                                }} onClick={goBack}>
                                    <KeyboardBackspaceOutlinedIcon sx={{ color: "#469BD3" }} />
                                    <Typography variant='subtitle2'
                                        sx={{
                                            color: "#469BD3", fontSize: 16,
                                            fontFamily: "Poppins"
                                        }}>Back</Typography>
                                </Box>
                            }
                            {isLoading ?
                                <Box sx={{
                                    marginLeft: "auto",
                                    display: "flex", width: 140, height: 40,
                                    alignItems: "center", cursor: "pointer",
                                    pl: 1, justifyContent: "center"
                                }}>
                                    {/* <CircularProgress size={30} /> */}
                                    <CircularProgressWithLabel />
                                </Box>
                                :
                                <Box sx={{
                                    opacity: stepCount === insideSteps.length - 1 ? 1 : 0.6,
                                    marginLeft: "auto",
                                    display: "flex", width: 140, height: 40,
                                    alignItems: "center", cursor: "pointer",
                                    pl: 1, backgroundColor: "#469BD3",
                                    justifyContent: "center", borderRadius: 1
                                }} onClick={goForward}>
                                    <Typography variant='subtitle2'
                                        sx={{
                                            color: "#fff", fontSize: 16,
                                            fontFamily: "Poppins"
                                        }}>Next step</Typography>
                                    <ArrowRightAltOutlinedIcon sx={{ color: "#fff" }} />
                                </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Box>
    )
}

export default LogiCLoseLayout