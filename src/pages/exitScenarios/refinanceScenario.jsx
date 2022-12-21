import React, { useCallback, useEffect, useState, Fragment } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Divider, Grid,
    CircularProgress, Alert, Snackbar, Fade, Modal, Backdrop
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/WebView/ExitScenariosPreview.png"
import Image from "next/image"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import dynamic from "next/dynamic"
import Loader from '../../components/Loader';
import { exitScenariosSteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import { useGetRefinanceScenarioQuery, useAddRefinanceScenarioMutation } from '../../services/query';
import { getData, storeData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC';
import CircularProgressWithLabel from '../../components/CircularLoader';
import PreviewModal from '../../components/PreviewModal';
import floorBackground from "../../../public/WebView/FloorBack.png"

const LogiCLoseLayout = dynamic(
    () => import("../../components/LogiCLoseLayout").then((p) => p.default),
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

const PreviewChild = () => <Box className='flex flex-col mt-4 py-6 pl-6'>
    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
        Refinance Scenario
    </Typography>
    <Box className='flex flex-row justify-between'>
        <Box className='flex flex-col w-4/6 mt-6 bg-[#f8fafc]
   px-4 pb-8 pt-2 rounded-xl'>
            <Box className='flex flex-row justify-between mt-5'>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Year
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        2021
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        NOI
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        951 SF
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Interest Rate
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        251 SF
                    </Typography>
                </Box>
            </Box>

            <Box className='flex flex-row justify-between mt-5'>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Constant
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        2021
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Annual Debt Service
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        951 SF
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Amort Period
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        251 SF
                    </Typography>
                </Box>
            </Box>

            <Box className='flex flex-row justify-between mt-5'>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        DSCR
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $250
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Loan Amount
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $150
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Debt Repayment
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $250
                    </Typography>
                </Box>
            </Box>

            <Box className='flex flex-row justify-between mt-5'>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Refi Fees
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $250
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Refi Proceeds
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $250
                    </Typography>
                </Box>
                <Box sx={{ width: 180 }}>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Other
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        $250
                    </Typography>
                </Box>
            </Box>
        </Box>
        <Box sx={{ width: '30%', mt: 4 }}>
            <Image src={floorBackground} layout='responsive' />
        </Box>
    </Box>
</Box>

const RefinanceScenario = ({ dimension }) => {

    const router = useRouter()
    const token = getData('token')
    const [stepCount, setStepCount] = useState(0)
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    const [subTitleId, setSubtitleId] = useState(0)
    const [title, setTitle] = useState('Refinance Scenario')
    const [refinanceScenarioState, setrefinanceScenarioState] = useState([
        { isShown: true, name: "year", label: "Year", placeholder: 'Year', value: '' },
        { isShown: true, name: "noi", label: "NOI", placeholder: 'Units', value: '' },
        { isShown: true, name: "interestRate", label: "Interest Rate", placeholder: 'Interest Rate', value: '' },
        { isShown: true, name: "refiProceeds", label: "Refi Proceeds", placeholder: 'Refi Proceeds', value: "" },
        { isShown: false, name: "annualDebtService", label: 'Annual Debt Service', placeholder: 'Annual Debt Service', value: '' },
        { isShown: false, name: "amortPeriod", label: 'Amort Period', placeholder: 'Amort Period', value: '' },
        { isShown: false, name: "dscr", label: 'DSCR', placeholder: 'DSCR', value: "" },
        { isShown: false, name: "loanAmount", label: 'Loan Amount', placeholder: 'Loan Amount', value: "" },
        { isShown: false, name: "debtRepayment", label: "Debt Repayment", placeholder: 'Debt Repayment', value: "" },
        { isShown: false, name: "refiFees", label: "Refi Fees", placeholder: 'Refi Fees', value: "" },
        { isShown: false, name: "constant", label: "Constant", placeholder: 'Constant', value: "" },
        { isShown: false, name: "other", label: "Other", placeholder: 'Other', value: "" },
    ])
    const [open, setOpen] = useState(false)

    const [fieldError, setfieldError] = useState()
    const [numberOfActiveFields, setNumberOfActiveFields] = useState(4)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [previewopen, setPreviewOpen] = useState(false)
    const handlePreviewOpen = () => setPreviewOpen(true);
    const handlePreviewClose = () => setPreviewOpen(false);

    const closeSnackBar = () => {
        setIsSnackBarOpen(false)
        setfieldError('')
    }

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Refinance Scenario')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const handleChange = (idx, text) => {
        let newFieldsData = [...refinanceScenarioState]
        newFieldsData[idx].value = text
        setrefinanceScenarioState(newFieldsData)
    }

    const toggleLabel = (idx) => {
        if (refinanceScenarioState[idx]['label'].trim() === '') {
            const newFIelds = [...refinanceScenarioState]
            newFIelds[idx]['label'] = 'Label'
            setrefinanceScenarioState(newFIelds)
        }
        setSubtitleId(idx)
        setTimeout(() => {
            if (idx === subTitleId) {
                setIsSubTitleEdit(!isSubTitleEdit)
            }
        }, 20)
    }
    const handleLabelChange = (idx, text) => {
        let newFieldsData = [...refinanceScenarioState]
        newFieldsData[idx].label = text
        setrefinanceScenarioState(newFieldsData)
    }

    const removeTestField = (idx) => {
        let newFieldsData = [...refinanceScenarioState]
        // newFieldsData.splice(idx, 1)
        newFieldsData[idx].isShown = false
        newFieldsData[idx].value = ''
        setrefinanceScenarioState(newFieldsData)
    }

    const addTestField = (idx) => {
        let newFieldsData = [...refinanceScenarioState]
        // newFieldsData.splice(idx, 1)
        newFieldsData[idx].isShown = true
        setrefinanceScenarioState(newFieldsData)
        handleClose()
    }

    const { data: refinanceData, isLoading: getting, error: summaryError } = useGetRefinanceScenarioQuery(token)
    const [submitRefinance, { isLoading, error, data }] = useAddRefinanceScenarioMutation()

    const handleSubmit = useCallback(() => {
        const isFieldEmpty = refinanceScenarioState.slice(0, 2).some(item => item.value.trim() === '')
        const reqData = refinanceScenarioState.reduce((prev, curr) => {
            const newItem = {
                ...prev,
                [curr.name]: {
                    subtitle: curr.label,
                    text: curr.value,
                    isCompleted: curr.isShown
                }
            }
            return newItem
        }, {})

        if (isFieldEmpty) {
            setfieldError("Required field is missing")
            setIsSnackBarOpen(true)
            return
        }
        let refinanceData = {}
        if (id) {
            refinanceData = { reqData, title, isStepCompleted: true, id }
        } else {
            refinanceData = { reqData, title, isStepCompleted: true }
        }
        submitRefinance({ refinanceData, token })
    }, [useAddRefinanceScenarioMutation, title, refinanceScenarioState])

    useEffect(() => {
        setNumberOfActiveFields(refinanceScenarioState.filter(item =>
            item.isShown).length)
    }, [refinanceScenarioState])

    useEffect(() => {
        if (refinanceData !== undefined) {
            const { createdAt, updatedAt, __v, _id, userId, isStepCompleted, title, ...rest } = refinanceData
            const newRefinanceArr = Object.keys(rest).map((item, idx) => {
                return {
                    name: item,
                    label: rest[item].subtitle,
                    placeholder: 'New text',
                    value: rest[item].text,
                    isShown: rest[item].isCompleted
                }
            })
            exitScenariosSteps[0].completed = isStepCompleted
            setrefinanceScenarioState(newRefinanceArr)
            setTitle(refinanceData.title)
            setId(refinanceData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === exitScenariosSteps[0].label) {
                    item.completed = refinanceData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [refinanceData])

    useEffect(() => {
        if (data !== undefined) {
            if (!saveContent) {
                setStepCount(prevStep => prevStep + 1)
                router.push("/exitScenarios/saleScenario")
            } else {
                setId(data._id)
            }
        }
        if (error !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, error])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={numberOfActiveFields > 4 ? "100%" : "100vh"}
            title={"Exit Scenarios"}
            insideSteps={exitScenariosSteps}
            stepCount={stepCount}
            goBackRoute={'/financialSummary/proforma'}
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
                    py: 2, px: 3, flexDirection: "column"
                }}>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {!isTitleEdit ?
                                <Typography variant='subtitle1'
                                    sx={{ fontFamily: "Poppins" }}>
                                    {title.slice(0, 30)} {title.length > 30 && '...'}
                                </Typography>
                                :
                                <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    style={{ fontFamily: "Poppins" }}
                                    placeholder="Enter title"
                                    type="text"
                                    size='small'
                                    value={title}
                                    onBlur={toggleTitle}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            }
                            {/* <HtmlTooltip
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                title={
                                    <Fragment>
                                        <Image
                                            src={summaryPreview}
                                            style={{ borderRadius: 5 }}
                                            height={80}
                                            width={300}
                                            alt="no image"
                                        />
                                    </Fragment>
                                }
                            >
                            </HtmlTooltip> */}
                            <Tooltip TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                title={"Preview example"}
                            >
                                <InfoOutlinedIcon sx={{ ml: 1, width: 15, height: 15, cursor: "pointer" }}
                                    onClick={() => handlePreviewOpen()} />
                            </Tooltip>
                            <svg onClick={toggleTitle} style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                            </svg>
                        </Box>
                        {isLoading ?
                            <Box sx={{
                                marginLeft: "auto",
                                letterSpacing: 1, mt: 2, width: 90,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}>
                                <CircularProgressWithLabel />
                            </Box>
                            :
                            <Button
                                className='bg-[#469BD3]'
                                type="submit"
                                variant="contained"
                                sx={{
                                    marginLeft: "auto",
                                    letterSpacing: 1, mt: 2, width: 90,
                                    fontFamily: "Poppins", fontWeight: "600"
                                }}
                                onClick={() => {
                                    setSaveContent(true)
                                    handleSubmit()
                                }}
                            >
                                Save
                            </Button>
                        }
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                    <Grid container sx={{ mt: 3, borderColor: "#424242" }}>
                        {refinanceScenarioState.map((field, idx) =>
                            field.isShown &&
                            <Grid key={idx}
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    pr: 2
                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                            {isSubTitleEdit && idx === subTitleId ?
                                                <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-8 rounded-md px-2 font-normal'
                                                    style={{ fontFamily: "Poppins", width: 150, fontSize: 13 }}
                                                    placeholder="Enter title"
                                                    type="text"
                                                    value={field.label}
                                                    onBlur={() => toggleLabel(idx)}
                                                    onChange={(e) =>
                                                        handleLabelChange(idx, e.target.value)}
                                                />
                                                :
                                                <Typography variant='subtitle2' sx={{ display: "flex", flexDirection: "row", fontSize: 13, fontFamily: "Poppins" }}>
                                                    {field.label}{idx < 2 && <Typography sx={{ color: "red" }}>*</Typography>}
                                                </Typography>
                                            }
                                            <svg onClick={() => toggleLabel(idx)}
                                                style={{ cursor: "pointer", marginLeft: 5, marginBottom: 5 }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.29199 8.25005H4.23533C4.29565 8.2504 4.35544 8.23884 4.41128 8.21603C4.46712 8.19322 4.51792 8.15962 4.56074 8.11714L7.73241 4.94089L9.03408 3.66672C9.07703 3.62411 9.11113 3.57342 9.1344 3.51757C9.15767 3.46172 9.16965 3.40181 9.16965 3.3413C9.16965 3.2808 9.15767 3.22089 9.1344 3.16504C9.11113 3.10919 9.07703 3.0585 9.03408 3.01589L7.09074 1.04964C7.04813 1.00668 6.99744 0.97258 6.94159 0.949312C6.88574 0.926043 6.82583 0.914062 6.76533 0.914062C6.70482 0.914063 6.64491 0.926043 6.58906 0.949312C6.53321 0.97258 6.48252 1.00668 6.43991 1.04964L5.14741 2.34672L1.96658 5.52297C1.9241 5.5658 1.89049 5.61659 1.86768 5.67243C1.84487 5.72827 1.83331 5.78807 1.83366 5.84839V7.79172C1.83366 7.91328 1.88195 8.02986 1.9679 8.11581C2.05386 8.20177 2.17043 8.25005 2.29199 8.25005ZM6.76533 2.0213L8.06241 3.31839L7.41158 3.96922L6.11449 2.67214L6.76533 2.0213ZM2.75033 6.0363L5.46824 3.31839L6.76533 4.61547L4.04741 7.33339H2.75033V6.0363ZM9.62533 9.16672H1.37533C1.25377 9.16672 1.13719 9.21501 1.05123 9.30096C0.965281 9.38692 0.916992 9.5035 0.916992 9.62505C0.916992 9.74661 0.965281 9.86319 1.05123 9.94915C1.13719 10.0351 1.25377 10.0834 1.37533 10.0834H9.62533C9.74688 10.0834 9.86346 10.0351 9.94942 9.94915C10.0354 9.86319 10.0837 9.74661 10.0837 9.62505C10.0837 9.5035 10.0354 9.38692 9.94942 9.30096C9.86346 9.21501 9.74688 9.16672 9.62533 9.16672Z" fill="#3E4A3D" />
                                            </svg>
                                        </Box>
                                        {idx > 3 &&
                                            <svg
                                                onClick={() => removeTestField(idx)} style={{ cursor: "pointer" }}
                                                width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                            </svg>
                                        }
                                    </Box>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder={field.placeholder}
                                        type="text"
                                        size="small"
                                        name={field.name}
                                        value={field.value}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        style={{ fontSize: 13, fontFamily: "Poppins" }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                    <Box className='flex flex-row justify-between'>
                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                            onClick={handleOpen}>
                            <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                            <Typography variant='subtitle2'
                                sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>Add New</Typography>
                        </Box>
                        {isLoading ?
                            <Box sx={{
                                marginLeft: "auto",
                                letterSpacing: 1, mt: 2, width: 90,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}>
                                <CircularProgressWithLabel />
                            </Box>
                            :
                            <Button
                                className='bg-[#469BD3]'
                                type="submit"
                                variant="contained"
                                sx={{
                                    marginLeft: "auto",
                                    letterSpacing: 1, mt: 2, width: 90,
                                    fontFamily: "Poppins", fontWeight: "600"
                                }}
                                onClick={() => {
                                    setSaveContent(false)
                                    handleSubmit()
                                }}
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
                    {error !== undefined ? error.data?.message : fieldError}
                </Alert>
            </Snackbar>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="transition-modal-title" variant="h6"
                            component="h2" sx={{ mb: 2, fontFamily: "Poppins", textAlign: "center" }}>
                            Choose fields to add
                        </Typography>
                        {numberOfActiveFields !== 12 ?
                            <Box>
                                {[...refinanceScenarioState].slice(4, refinanceScenarioState.length).map((item, idx) =>
                                    !item.isShown &&
                                    <Box key={idx} sx={{
                                        cursor: "pointer",
                                        display: "flex", justifyContent: "center",
                                        height: 30, mb: 1, borderWidth: 1, borderColor: "#bdbdbd",
                                    }} onClick={() => addTestField(idx + 4)}>
                                        <Typography id="transition-modal-title" variant="subtitle1"
                                            component="h4" sx={{ fontFamily: "Poppins" }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            :
                            <Typography id="transition-modal-title" variant="subtitle1"
                                component="h4" sx={{ fontFamily: "Poppins", textAlign: "center" }}>
                                All fields are added
                            </Typography>
                        }
                    </Box>
                </Fade>
            </Modal>
            <PreviewModal open={previewopen} handleClose={handlePreviewClose}
                wrapperComponent={PreviewChild} imgSrc={summaryPreview} />
        </LogiCLoseLayout>
    );
}

export default IsAuthHOC(RefinanceScenario, "/exitScenarios/refinanceScenario");