import React, { useState, useCallback, useEffect, Fragment } from 'react';
import {
    Box, Typography, TextField, Button, Snackbar,
    Paper, CircularProgress, Alert, Fade, Modal, Backdrop
} from '@mui/material';
import Image from "next/image"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import dynamic from "next/dynamic"
import Loader from '../../components/Loader';
import { executiveSummarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import { removeField } from '../../utils/removeFields';
import {
    useAddInvestmentOpportunityMutation, useGetInvestmentOpportunityQuery,
    useUpdateInvestmentOpportunityMutation
} from "../../services/query"
import { getData, storeData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC';
// import summaryPreview from "../../../public/assets/SummaryPreview.png"
import opportunityPreview from "../../../public/WebView/OpportunityPreview.png"
import CircularProgressWithLabel from '../../components/CircularLoader';
import PreviewModal from '../../components/PreviewModal';

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

const PreviewChild = () => <Box className='flex flex-col rounded-3xl my-6 mx-4 p-6 bg-[#ECF6FF]'>
    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
        Investment Oppurtunity
    </Typography>
    <Typography variant='subtitle2' mt={2} sx={{ mt: 2, color: '#868585', fontFamily: "Poppins", lineHeight: 2 }}>
        Sem nunc magna viverra sed. Lacinia hac vestibulum a eget dui. Dolor enim sed amet eget diam sed egestas rhoncus egestas. Urna arcu metus sapien, consectetur dictum in leo parturient. Parturient ultrices morbi scelerisque vestibulum. Leo, erat viverra interdum orci ornare tempor quam est. Dolor cursus pulvinar etiam neque orci et ac tincidunt non. Quam tristique nec volutpat dolor. Sapien rutrum fringilla amet eget at. Aliquet massa est risus id nullam quam ut. Sem nunc magna viverra sed. Lacinia hac vestibulum a eget dui. Dolor enim sed amet eget diam sed egestas rhoncus egestas. Urna arcu metus sapien, consectetur dictum in leo parturient. Parturient ultrices morbi scelerisque vestibulum.</Typography>
</Box>

const InvestmentOppurtunity = ({ dimension }) => {

    const token = getData('token')
    const router = useRouter()
    const [stepCount, setStepCount] = useState(1)
    const [id, setId] = useState(null)
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [saveContent, setSaveContent] = useState(false)
    const [title, setTitle] = useState('Investment Opportunity')
    const [noOfTextFields, setNoOfTextFields] = useState([
        { description: '' }
    ])
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const closeSnackBar = () => setIsSnackBarOpen(false)

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Investment Opportunity')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const handleChange = (idx, e) => {
        let newFieldsData = [...noOfTextFields]
        newFieldsData[idx][e.target.name] = e.target.value
        setNoOfTextFields(newFieldsData)
    }

    const isSCreenExpandable = () => {
        if (noOfTextFields.length > 1) {
            return false
        }
        return true
    }

    const { data: opportunityData, isLoading: opportunityLoading, error: opportunityError } = useGetInvestmentOpportunityQuery(token)
    const [submitInvestmentOpportunity, { isLoading, error, data }] = useAddInvestmentOpportunityMutation()
    const [updateInvestmenOpportunity, { isLoading: updating, error: updateError, data: updateData }] = useUpdateInvestmentOpportunityMutation()

    const handleSubmit = useCallback(() => {
        const descriptionArr = noOfTextFields.map(text => text.description)
        let formData = {
            title,
            descriptionArr
        }
        // if (noOfTextFields.some(item => item.description.trim() === '')) {
        //     setIsSnackBarOpen(true)
        //     return
        // }
        if (!id) {
            submitInvestmentOpportunity({ formData, token })
        } else {
            formData['id'] = id
            updateInvestmenOpportunity({ formData, token })
        }

    }, [useAddInvestmentOpportunityMutation, useUpdateInvestmentOpportunityMutation, title, noOfTextFields])

    useEffect(() => {
        if ((data !== undefined || updateData !== undefined) && !saveContent) {
            setStepCount(prevStep => prevStep + 1)
            router.push("/executiveSummary/demographicSummary")
        } else if (data !== undefined) {
            setId(data._id)
        } else if (updateData !== undefined) {
            setId(updateData._id)
        }
        if (error !== undefined || updateError !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, updateData, error, updateError, saveContent])

    useEffect(() => {
        if (opportunityData !== undefined) {
            const newDescriptionArr = opportunityData.descriptionArr.map(dsc =>
                ({ description: dsc })
            )
            executiveSummarySteps[1].completed = opportunityData.isStepCompleted
            setNoOfTextFields(newDescriptionArr)
            setTitle(opportunityData.title)
            setId(opportunityData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === executiveSummarySteps[1].label) {
                    item.completed = opportunityData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [opportunityData])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={isSCreenExpandable() ? "100vh" : "100%"}
            title={"Executive Summary"}
            insideSteps={executiveSummarySteps}
            stepCount={stepCount}
            goBackRoute={'/executiveSummary/investmentSummary'}
        >
            {opportunityLoading ?
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
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {!isTitleEdit ?
                                <Typography variant='subtitle1'
                                    sx={{ fontFamily: "Poppins" }}>
                                    {title.slice(0, 30)} {title.length > 30 && '...'}
                                </Typography>
                                :
                                <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    placeholder="Enter title" style={{ fontFamily: "Poppins" }}
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
                                            height={300}
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
                                    onClick={() => handleOpen()} />
                            </Tooltip>
                            <svg onClick={toggleTitle} style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                            </svg>
                        </Box>
                        {isLoading || updating ?
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
                    {noOfTextFields.map((item, idx) =>
                        <Box key={idx} sx={{
                            position: "relative",
                            mt: noOfTextFields.length > 1 && idx !== 0 ? 4 : 2
                        }}>
                            <textarea className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-100 rounded-md px-2 py-2 font-normal'
                                style={{ fontFamily: "Poppins" }}
                                placeholder="Enter Investment Oppurtunity"
                                type="text"
                                name='description'
                                value={item.description}
                                rows='5'
                                cols='50'
                                onChange={e => handleChange(idx, e)}
                            />
                            {idx !== 0 &&
                                <svg
                                    onClick={() =>
                                        removeField(idx, noOfTextFields, setNoOfTextFields)}
                                    style={{ cursor: "pointer", position: "absolute", top: -20, right: 0 }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                </svg>
                            }
                        </Box>
                    )}
                    <Box className='flex flex-row justify-between'>
                        <Box
                            aria-haspopup="true"
                            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                            onClick={() => setNoOfTextFields(prev => [...prev, { description: '' }])}
                        >
                            <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                            <Typography variant='subtitle2'
                                sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>Add New</Typography>
                        </Box>
                        {isLoading || updating ?
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
                    {error !== undefined ? error.data.message : 'You must enter first investment opportunity'}
                </Alert>
            </Snackbar>
            <PreviewModal wrapperComponent={PreviewChild}
                open={open} handleClose={handleClose}
                imgSrc={opportunityPreview} />
        </LogiCLoseLayout>
    );
}

export default IsAuthHOC(InvestmentOppurtunity, "/executiveSummary/investmentOppurtunity");