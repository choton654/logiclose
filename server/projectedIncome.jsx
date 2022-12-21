import React, { useCallback, useEffect, useState, Fragment } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Fade,
    Divider, Snackbar, Alert, CircularProgress
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/assets/ProjectedIncomePreview.png"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from "next/image"
import dynamic from "next/dynamic"
import Loader from './src/components/Loader';
import { financialSummarySteps } from "./src/utils/steps"
import { useRouter } from 'next/router';
import { useAddProjectedIncomeMutation, useGetProjectedIncomeQuery } from './src/services/query';
import { getData, storeData } from './src/utils/localStorage';
import IsAuthHOC from './src/components/IsAuthHOC';
import CircularProgressWithLabel from './src/components/CircularLoader';

const LogiCLoseLayout = dynamic(
    () => import("./src/components/LogiCLoseLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#FBFBFC',
        maxWidth: 500, paddingLeft: 10,
        border: '1px solid #dadde9',
    },
}));

const ProjectedIncome = ({ dimension }) => {

    const router = useRouter()
    const [stepCount, setStepCount] = useState(3)
    const token = getData('token')
    const [id, setId] = useState(null)
    const [title, setTitle] = useState('Projected Income & Annual Rent')
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    const [subTitleId, setSubtitleId] = useState(0)
    const [projectedIncomeState, setprojectedIncomeState] = useState([{
        subTitle: `Label 1`,
        description: ''
    }])

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const closeSnackBar = () => setIsSnackBarOpen(false)

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Projected Income & Annual Rent')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const toggleSubTitle = (idx) => {
        if (projectedIncomeState[idx]['subTitle'].trim() === '') {
            const newFIelds = [...projectedIncomeState]
            newFIelds[idx]['subTitle'] = 'Projected Income & Annual Rent'
            setprojectedIncomeState(newFIelds)
        }
        setSubtitleId(idx)
        setTimeout(() => {
            if (idx === subTitleId) {
                setIsSubTitleEdit(!isSubTitleEdit)
            }
        }, 20)
    }

    const removeTestField = (idx) => {
        let newFieldsData = [...projectedIncomeState]
        newFieldsData.splice(idx, 1)
        setprojectedIncomeState(newFieldsData)
    }

    const handleChange = (idx, text) => {
        const newFIelds = [...projectedIncomeState]
        newFIelds[idx]['description'] = text
        setprojectedIncomeState(newFIelds)
    }

    const handleSubtitleChange = (idx, text) => {
        const newFIelds = [...projectedIncomeState]
        newFIelds[idx]['subTitle'] = text
        setprojectedIncomeState(newFIelds)
    }

    const [submitProjectedIncome, { isLoading, data, error }] = useAddProjectedIncomeMutation()
    const { data: projectedIncomeData, isLoading: getting, error: getError } = useGetProjectedIncomeQuery(token)

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    const handleSubmit = useCallback(() => {
        let isEmptyField = false
        projectedIncomeState.forEach((item, idx) => {
            if (item.subTitle.trim() === '' || item.description.trim() === '') {
                isEmptyField = true
            }
        })
        if (isEmptyField) {
            setIsSnackBarOpen(true)
            return
        }
        const formData = { reqData: projectedIncomeState, title }
        if (id) {
            formData['id'] = id
        }
        submitProjectedIncome({ formData, token })
    }, [useAddProjectedIncomeMutation, title, projectedIncomeState])

    useEffect(() => {
        if (projectedIncomeData !== undefined) {
            setprojectedIncomeState(projectedIncomeData.featureData.map(item => ({
                subTitle: item.subTitle,
                description: item.description
            })))
            setTitle(projectedIncomeData.title)
            setId(projectedIncomeData._id)
            financialSummarySteps[3].completed = projectedIncomeData.isStepCompleted
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === financialSummarySteps[3].label) {
                    item.completed = projectedIncomeData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [projectedIncomeData])

    useEffect(() => {
        if (data !== undefined) {
            setStepCount(prevStep => prevStep + 1)
            router.push("/financialSummary/proforma")
        }
        if (error !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, error])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={projectedIncomeState.length > 2 ? "100%" : "100vh"}
            title={"Financial Summary"}
            insideSteps={financialSummarySteps}
            stepCount={stepCount}
            goBackRoute={'/financialSummary/debtAssumptions'}
        >
            {getting ?
                <Box sx={{
                    display: "flex", height: "100%", justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CircularProgress size={50} />
                </Box>
                :
                <Paper sx={{
                    display: "flex", width: "100%", boxShadow: "0 0 20px 5px #e2e8f0",
                    p: 2, flexDirection: "column"
                }}>
                    <Box sx={{
                        display: "flex", justifyContent: "space-between", flexDirection: "column",
                        height: "100%"
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {!isTitleEdit ?
                                        <Typography variant='subtitle1'
                                            sx={{ fontFamily: "Poppins" }}>
                                            {title.slice(0, 30)} {title.length > 30 && '...'}
                                        </Typography>
                                        :
                                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                            placeholder="Enter title"
                                            type="text"
                                            size='small'
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)}
                                            style={{ width: 180, fontFamily: "Poppins" }}
                                        />
                                    }
                                    <HtmlTooltip
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        title={
                                            <Fragment>
                                                <Image
                                                    src={summaryPreview}
                                                    style={{ borderRadius: 5 }}
                                                    height={100}
                                                    width={300}
                                                    alt="no image"
                                                />
                                            </Fragment>
                                        }
                                    >
                                        <InfoOutlinedIcon sx={{ ml: 1, width: 15, height: 15, cursor: "pointer" }} />
                                    </HtmlTooltip>
                                    <svg onClick={toggleTitle} style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                                    </svg>
                                </Box>
                                <Box onClick={() => setprojectedIncomeState(prev => [...prev,
                                { subTitle: `Label ${projectedIncomeState.length + 1}`, description: '' }])}
                                    sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                    <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                                    <Typography variant='subtitle2'
                                        sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>
                                        Add New
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mt: 1, mb: 2 }} />
                            {projectedIncomeState.map((item, idx) =>
                                <Box key={idx} sx={{
                                    display: "flex",
                                    flexDirection: "column", mt: idx > 0 ? 2 : 0,
                                    width: isMobileDevice() ? "100%" : "48%"
                                }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            {isSubTitleEdit && idx === subTitleId ?
                                                <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                                    placeholder="Enter title"
                                                    type="text"
                                                    size='small'
                                                    onBlur={() => toggleSubTitle(idx)}
                                                    value={item.subTitle}
                                                    onChange={(e) =>
                                                        handleSubtitleChange(idx, e.target.value)}
                                                    style={{ width: 180, fontSize: 13, fontFamily: "Poppins" }}
                                                /> :
                                                <Typography variant='subtitle2'
                                                    sx={{ fontFamily: "Poppins" }}>
                                                    {item.subTitle.slice(0, 30)} {item.subTitle.length > 30 && '...'}
                                                </Typography>
                                            }
                                            <svg onClick={() => toggleSubTitle(idx)}
                                                style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                                            </svg>
                                        </Box>
                                        <Box sx={{ display: "flex" }}>
                                            {/* <svg style={{ marginRight: 15, cursor: 'pointer' }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.24775 12.7501V12.7501C9.24775 12.8284 9.17924 12.9 9.08692 12.9H2.30439C2.21207 12.9 2.14356 12.8284 2.14356 12.7501V4.75014L2.14356 4.75004C2.14349 4.67182 2.21204 4.60005 2.30439 4.60005H3.50879V10.2499C3.50879 10.9987 4.14248 11.6 4.91319 11.6H9.24812L9.24775 12.7501ZM4.75218 2.25018L4.75218 2.25008C4.7521 2.17186 4.82066 2.10009 4.913 2.10009H11.6955C11.7879 2.10009 11.8564 2.17173 11.8564 2.25005L11.8565 10.2501C11.8565 10.3285 11.788 10.4001 11.6957 10.4001H9.87228H9.86952H9.86691H4.913C4.82068 10.4001 4.75218 10.3285 4.75218 10.2501L4.75218 2.25018ZM11.6956 0.9H4.91306C4.14235 0.9 3.50866 1.5013 3.50866 2.25005V3.39996H2.3044C1.53369 3.39996 0.9 4.00125 0.9 4.75V12.75C0.9 13.4987 1.53369 14.1 2.3044 14.1H9.08694C9.85765 14.1 10.4913 13.4987 10.4913 12.75V11.6H11.6956C12.4663 11.6 13.1 10.9987 13.1 10.25V2.25005C13.1 1.50183 12.4663 0.9 11.6956 0.9Z" fill="#469BD3" stroke="#469BD3" strokeWidth="0.2" />
                                            </svg> */}
                                            {idx !== 0 &&
                                                <svg style={{ cursor: 'pointer' }} onClick={() => removeTestField(idx)} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                                </svg>
                                            }
                                        </Box>
                                    </Box>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder='Value (Input Field)'
                                        size='small'
                                        type="text"
                                        value={item.description}
                                        onChange={(e) =>
                                            handleChange(idx, e.target.value)}
                                        style={{ fontSize: 13, marginTop: 2, fontFamily: 'Poppins' }}
                                    />
                                </Box>
                            )}
                        </Box>
                        {isLoading ?
                            <Box sx={{
                                marginLeft: "auto",
                                letterSpacing: 1, mt: 2, width: 90,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}>
                                {/* <CircularProgress size={30} /> */}
                                <CircularProgressWithLabel />
                            </Box>
                            :
                            <Button
                                className='bg-[#469BD3]'
                                type="submit"
                                variant="contained"
                                sx={{
                                    marginLeft: "auto",
                                    letterSpacing: 1, mt: 7, width: 90,
                                    fontFamily: "Poppins", fontWeight: "600"
                                }}
                                onClick={handleSubmit}
                            >
                                Next
                            </Button>
                        }
                    </Box>
                </Paper>
            }
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                open={isSnackBarOpen}
                onClose={closeSnackBar}
                key={'bottomcenter'}
            >
                <Alert onClose={closeSnackBar} severity="error" sx={{ width: '100%' }}>
                    {error !== undefined ? error.data?.message : "Field can't be empty"}
                </Alert>
            </Snackbar>
        </LogiCLoseLayout>
    );
}

export default IsAuthHOC(ProjectedIncome, "/financialSummary/projectedIncome");
