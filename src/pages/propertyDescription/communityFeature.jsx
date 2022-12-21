import React, { useCallback, useEffect, useState, Fragment } from 'react';
import {
    Box, Typography, TextField, Button, Alert, Fade,
    Paper, Divider, CircularProgress, Snackbar
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/WebView/CommunityFeaturePreview.png"
import Image from "next/image"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import dynamic from "next/dynamic"
import Loader from '../../components/Loader';
import { propertySumarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import {
    useAddCommunityFeatureMutation, useGetCommunityFeatureQuery,
    useUpdateCommunityFeatureMutation
} from '../../services/query';
import { getData, storeData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC';
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

const PreviewChild = () =>
    <Box className='flex flex-col pr-3 my-6 px-6'>
        <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
            Community Features
        </Typography>
        <Box className='flex flex-col' sx={{ mt: 5 }}>
            <Box className='flex flex-row justify-between'>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 1
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 1
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 2
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 2
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 3
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 3
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 4
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 4
                    </Typography>
                </Box>
            </Box>

            <Box className='flex flex-row justify-between mt-5'>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 5
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 5
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 6
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 6
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 7
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 7
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Feature 8
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                        Community Features Label 8
                    </Typography>
                </Box>
            </Box>
        </Box>
    </Box>

const CommunitySummary = ({ dimension }) => {

    const router = useRouter()
    const [stepCount, setStepCount] = useState(1)
    const token = getData('token')
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    const [title, setTitle] = useState('Community Features')
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    const [subTitleId, setSubtitleId] = useState(0)
    const [errorIdx, setErrorIdx] = useState(0)
    const [communityState, setCommunityState] = useState([{
        subTitle: `Community Feature 1`,
        description: ''
    }])

    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const closeSnackBar = () => setIsSnackBarOpen(false)

    const [previewopen, setPreviewOpen] = useState(false)
    const handlePreviewOpen = () => setPreviewOpen(true);
    const handlePreviewClose = () => setPreviewOpen(false);

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Community Features')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const toggleSubTitle = (idx) => {
        if (communityState[idx]['subTitle'].trim() === '') {
            const newFIelds = [...communityState]
            newFIelds[idx]['subTitle'] = 'Community Summary'
            setCommunityState(newFIelds)
        }
        setSubtitleId(idx)
        setTimeout(() => {
            if (idx === subTitleId) {
                setIsSubTitleEdit(!isSubTitleEdit)
            }
        }, 20)
    }

    const removeTestField = (idx) => {
        let newFieldsData = [...communityState]
        newFieldsData.splice(idx, 1)
        setCommunityState(newFieldsData)
    }

    const handleChange = (idx, e) => {
        const newFIelds = [...communityState]
        newFIelds[idx]['description'] = e.target.value
        setCommunityState(newFIelds)
    }

    const handleSubtitleChange = (idx, e) => {
        const newFIelds = [...communityState]
        newFIelds[idx]['subTitle'] = e.target.value
        setCommunityState(newFIelds)
    }

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    const isSCreenExpandable = useCallback(() => {
        if (communityState.length > 1) {
            return true
        }
        return false
    }, [communityState.length])

    const { data: communityData, isLoading: gettingData, error: communityError } = useGetCommunityFeatureQuery(token)
    const [updateCCommunityFeature, { isLoading: updating, error: updateError, data: updateData }] = useUpdateCommunityFeatureMutation()
    const [submitCommunityFeature, { isLoading, error, data }] = useAddCommunityFeatureMutation()

    const handleSubmit = useCallback(() => {
        let isEmptyField = false
        communityState.forEach((item, idx) => {
            if (item.subTitle.trim() === ''
                // || item.description.trim() === ''
            ) {
                isEmptyField = true
                setErrorIdx(idx)
            }
        })
        if (isEmptyField) {
            setIsSnackBarOpen(true)
            return
        }
        if (!id) {
            submitCommunityFeature({ communityData: { reqData: communityState, title }, token })
        } else {
            updateCCommunityFeature({ communityData: { reqData: communityState, title, id }, token })
        }
    }, [useAddCommunityFeatureMutation, title, communityState])

    useEffect(() => {
        if (communityData !== undefined) {
            setCommunityState(communityData.featureData.map(item => ({
                subTitle: item.subTitle,
                description: item.description
            })))
            setTitle(communityData.title)
            setId(communityData._id)
            propertySumarySteps[1].completed = communityData.isStepCompleted
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === propertySumarySteps[1].label) {
                    item.completed = communityData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [communityData])

    useEffect(() => {
        if ((data !== undefined || updateData !== undefined) && !saveContent) {
            setStepCount(prevStep => prevStep + 1)
            router.push("/propertyDescription/unitFeatures")
        } else if (data !== undefined) {
            setId(data._id)
        } else if (updateData !== undefined) {
            setId(updateData._id)
        }
        if (error !== undefined || updateError !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, updateData, error, updateError, saveContent])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={isMobileDevice() || isSCreenExpandable() ? "100%" : "100vh"}
            title={"Property Summary"}
            insideSteps={propertySumarySteps}
            stepCount={stepCount}
            goBackRoute={'/propertyDescription/propertySummary'}
        >
            {gettingData ?
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
                                    placeholder="Enter title"
                                    type="text"
                                    size='small'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: 250, fontFamily: "Poppins" }}
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
                                            height={100}
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
                            <svg onClick={toggleTitle} style={{ cursor: "pointer", marginLeft: 10 }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                            </svg>
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
                                    setSaveContent(true)
                                    handleSubmit()
                                }}
                            >
                                Save
                            </Button>
                        }
                    </Box>
                    <Divider sx={{ mt: 1, mb: 2 }} />
                    {communityState.map((item, idx) =>
                        <Box key={idx} sx={{ mt: idx > 0 ? 3 : 0 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {isSubTitleEdit && idx === subTitleId ?
                                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                            placeholder="Enter title"
                                            type="text"
                                            size='small'
                                            onBlur={() => toggleSubTitle(idx)}
                                            value={item.subTitle}
                                            onChange={(e) => handleSubtitleChange(idx, e)}
                                            style={{ width: 180, fontFamily: "Poppins" }}
                                        />
                                        :
                                        <Typography variant='subtitle1'
                                            sx={{ fontFamily: "Poppins" }}>
                                            {item.subTitle.slice(0, 30)} {item.subTitle.length > 30 && '...'}
                                        </Typography>
                                    }
                                    <svg onClick={() => toggleSubTitle(idx)} style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                                    </svg>
                                </Box>
                                {idx > 0 &&
                                    <svg
                                        onClick={() => removeTestField(idx)}
                                        style={{ cursor: "pointer", marginLeft: 10 }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                    </svg>
                                }
                            </Box>
                            <textarea className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-100 rounded-md px-2 py-2 font-normal'
                                style={{ fontFamily: "Poppins", width: "100%", height: "80%", mt: 1 }}
                                placeholder="Community Feature Description"
                                type="text"
                                name='description'
                                rows='5'
                                cols='50'
                                error={errorIdx === idx && isSnackBarOpen}
                                value={item.description}
                                onChange={(e) => handleChange(idx, e)}
                            />
                        </Box>
                    )}
                    <Box className="flex flex-row justify-between">
                        <Box sx={{ display: "flex", alignItems: "center", cursor: 'pointer' }}
                            onClick={() => setCommunityState(prev => [...prev,
                            { subTitle: `Community Feature ${communityState.length + 1}`, description: '' }])}>
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
                </Paper>
            }
            <PreviewModal open={previewopen} handleClose={handlePreviewClose}
                wrapperComponent={PreviewChild} imgSrc={summaryPreview} />
        </LogiCLoseLayout>
    );
}

export default IsAuthHOC(CommunitySummary, "/propertyDescription/communityFeature");
