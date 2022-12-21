import React, { useCallback } from 'react';
import {
    Box, Stepper, Step, StepLabel, Paper,
    StepConnector, Typography
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useRouter } from 'next/router';

const Steps = ({ stepCount, insideSteps, dimension }) => {

    const cacheSteps = JSON.parse(localStorage.getItem('stepCompleted'))
    if (cacheSteps) {
        insideSteps = insideSteps.map(item => {
            const newStep = cacheSteps.find(cItem => item.label === cItem.label)
            return { ...item, ...newStep }
        })
    }
    const router = useRouter()

    const isLargeStep = useCallback(() => {
        if (insideSteps.length > 3) { return true }
    }, [insideSteps])

    const isSmallStep = useCallback(() => {
        if (insideSteps.length < 3) { return true }
    }, [insideSteps])

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    return (
        <Paper sx={{
            display: "flex", width: "100%", height: 130, my: 3,
            justifyContent: "center", alignItems: "center",
            boxShadow: "0 0 20px 5px #e2e8f0", p: isMobileDevice() ? 2 : 3
        }}>
            <Stepper activeStep={stepCount} alternativeLabel
                sx={{ width: isMobileDevice() ? "100%" : isLargeStep() ? "80%" : isSmallStep() ? "30%" : "50%" }}
                connector={
                    !isMobileDevice() &&
                    <StepConnector
                        sx={{
                            width: "60%", height: 4,
                            backgroundColor: "#469BD3",
                            borderRadius: 50, marginLeft: "auto",
                            marginRight: "auto"
                        }} />}
            >
                {insideSteps.map((item, idx) => (
                    <Step key={idx} sx={{
                        display: "flex", width: "10%",
                        justifyContent: "center", alignItems: "center"
                    }}>
                        <StepLabel className='hover:scale-125 duration-200' sx={{ cursor: 'pointer' }}
                            StepIconComponent={({ active, completed, error }) => {
                                return <Box
                                    sx={{
                                        cursor: 'pointer',
                                        display: "flex",
                                        width: isMobileDevice() ? 25 : 30,
                                        height: isMobileDevice() ? 25 : 30,
                                        borderRadius: 20,
                                        backgroundColor: completed || item.completed ? "#469BD3" : "#FFF",
                                        alignItems: "center", justifyContent: "center",
                                        borderWidth: completed ? 0 : 3,
                                        borderColor: active ? "#F27A30" : "##E5E0EB",
                                    }} onClick={() => router.push(item.route)}>
                                    <CheckIcon sx={{ color: item.completed || completed ? "#FFF" : active ? "#F27A30" : "#E5E0EB" }} />
                                </Box>
                            }}>
                            <Typography variant='subtitle2' sx={{
                                fontSize: isMobileDevice() ? 8 : 12,
                                fontFamily: "Poppins"
                            }}>{item.label}</Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    );
}

export default Steps;
