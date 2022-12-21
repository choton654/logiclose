import React, { useState, useMemo, useCallback, useEffect, Fragment } from 'react';
import {
    Box, Typography, TextField, Snackbar,
    Paper, Grid, Alert, Fade, CircularProgress, Button
} from '@mui/material';
import Image from "next/image"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { logiCloseSlice } from "../../features/logicloseSlice"
import { executiveSummarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import { removeField } from '../../utils/removeFields';
import { dropzoneStyle } from '../../utils/dropzoneStyle';
import { useDropzone } from 'react-dropzone';
import {
    useAddDemographicSummaryMutation, useGetDemographicSummaryQuery,
    useUpdateDemographicSummaryMutation
} from "../../services/query"
import { getData, storeData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC';
import { useDispatch } from 'react-redux';
import summaryPreview1 from "../../../public/assets/summary1.png"
import summaryPreview2 from "../../../public/assets/summary2.png"
import summaryPreview3 from "../../../public/assets/summary3.png"
import summaryPreview4 from "../../../public/assets/summary4.png"
import demographicPreview from "../../../public/WebView/DemographicPreview.png"
import { BASE_URL } from '../../utils/api';
import CircularProgressWithLabel from '../../components/CircularLoader';
import LogiCLoseLayout from "../../components/LogiCLoseLayout"
import PreviewModal from '../../components/PreviewModal';
import { FreeMode, Navigation, Thumbs } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import locationOverview from "../../../public/WebView/LocationOverview.png"

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#FBFBFC',
        maxWidth: 500, paddingLeft: 10,
        border: '1px solid #dadde9',
    },
}));

const PreviewChild = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return <Box className='flex flex-row rounded-3xl mt-6 mx-4 p-6 justify-between'>
        <Box className='mb-6 z-20' sx={{ width: '40%' }}>
            <Swiper
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                    height: 250
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-1/4 cursor-pointer"
            >
                <SwiperSlide>
                    <Image src={summaryPreview1} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview2} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview3} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview4} width={500} height={300} />
                </SwiperSlide>
            </Swiper>
            <Swiper
                // onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="cursor-pointer"
            >
                <SwiperSlide>
                    <Image src={summaryPreview1} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview2} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview3} width={500} height={300} />
                </SwiperSlide>
                <SwiperSlide>
                    <Image src={summaryPreview4} width={500} height={300} />
                </SwiperSlide>
            </Swiper>
        </Box>

        <Box sx={{ ml: 6, width: '60%' }}>
            <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                Demographic Summary
            </Typography>
            <Typography variant='subtitle2' mt={2} sx={{ mt: 2, color: '#868585', fontFamily: "Poppins", lineHeight: 2 }}>
                Sem nunc magna viverra sed. Lacinia hac vestibulum a eget dui. Dolor enim sed amet eget diam sed egestas rhoncus egestas. Urna arcu metus sapien, consectetur dictum in leo parturient. Parturient ultrices morbi scelerisque vestibulum. Leo, erat viverra interdum orci ornare tempor quam est. Dolor cursus pulvinar etiam neque orci et ac tincidunt non. Quam tristique nec volutpat dolor. Sapien rutrum fringilla amet eget at. Aliquet massa est risus id nullam quam ut. Sem nunc magna viverra sed. Lacinia hac vestibulum a eget dui. Dolor enim sed amet eget diam sed egestas rhoncus egestas. Urna arcu metus sapien, consectetur dictum in leo parturient. Parturient ultrices morbi scelerisque vestibulum.</Typography>
        </Box>
    </Box>
}

const DemographicSummary = ({ dimension }) => {

    const router = useRouter()
    const dispatch = useDispatch()
    const token = getData('token')
    const { increment } = logiCloseSlice.actions
    const [stepCount, setStepCount] = useState(2)
    const [id, setId] = useState(null)
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [saveContent, setSaveContent] = useState(false)
    const [title, setTitle] = useState('Demographic Summary')
    const [imageFieldEmpty, setImageFieldEmpty] = useState(false)
    const [noOfTextFields, setNoOfTextFields] = useState([
        { description: '' }
    ])

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        // maxFiles: files.length,
        accept: { 'image/*': [] },
        onDrop: async acceptedFiles => {
            const formData = new FormData()
            acceptedFiles.forEach(item => {
                formData.append('uploads', item)
            })
            setFiles([...files, ...acceptedFiles.map(file => ({
                preview: 'loading'
            }))])
            const fileRes = await fetch(`${BASE_URL}/api/uploadfile`, {
                method: 'POST', body: formData,
                headers: { 'authorization': token }
            })
            const newFiles = await fileRes.json()
            const withOutLoading = files.filter(item => item.preview !== 'loading')
            setFiles([...withOutLoading, ...newFiles.data.map(file => ({ preview: file }))]);
        }
    })
    // useEffect(() => {
    //     if (files.length === 0) {
    //         setFiles([])
    //     }
    // }, [files])

    const removeFields = (idx) => {
        const dFile = [...files]
        dFile[idx].preview = undefined
        setFiles(dFile)
    }
    const style = useMemo(() => dropzoneStyle, [])
    const imageArr = files.map((file, idx) => (
        file.preview !== undefined &&
        <Grid
            className='transform hover:-translate-x hover:scale-110'
            key={idx}
            item
            xs={5}
            sm={3}
            md={2}
            sx={{
                position: "relative",
                mt: 1, display: "flex", mx: 1,
                borderWidth: !file.preview && imageFieldEmpty ? 1 : 0,
                borderColor: 'red',
                height: 125,
                width: 125,
            }}
            component={Paper}
            elevation={2}
        >
            {file.preview === 'loading' ?
                <Box sx={{
                    display: "flex", height: '100%',
                    width: '100%', justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CircularProgressWithLabel />
                </Box>
                :
                <img
                    src={file.preview}
                    style={{
                        display: 'block',
                        borderRadius: 5,
                        width: '100%',
                        height: '100%'
                    }}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    alt={`img${idx}`}
                />
            }
            {file.preview !== 'loading' &&
                <svg onClick={() => removeFields(idx)}
                    style={{
                        position: "absolute",
                        top: 5, right: 5, width: 15, height: 15,
                        color: "red", cursor: "pointer"
                    }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                </svg>
            }
        </Grid>
    ));
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const closeSnackBar = () => {
        setImageFieldEmpty(false)
        setIsSnackBarOpen(false)
    }

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Demographic Summary')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const handleChange = (idx, e) => {
        let newFieldsData = [...noOfTextFields]
        newFieldsData[idx][e.target.name] = e.target.value
        setNoOfTextFields(newFieldsData)
    }

    const [updateDemographicSummer, { isLoading: updating, error: updateError, data: updatedData }] = useUpdateDemographicSummaryMutation()
    const [submitDemographicSummer, { isLoading, error, data }] = useAddDemographicSummaryMutation()
    const { data: demographicData, isLoading: getting, error: getDataError } = useGetDemographicSummaryQuery(token)

    const handleSubmit = useCallback(() => {
        let formData = new FormData()
        formData.append('title', title)
        formData.append('descriptionArr', JSON.stringify(noOfTextFields.map(text => text.description)))
        let images = []
        files.forEach(file => {
            if (file.name !== undefined) {
                formData.append('uploads', file)
            } else if (!file.preview || file.preview !== undefined) {
                images.push(file.preview)
            }
        })
        formData.append('images', JSON.stringify(images.filter(item => item)))
        // const isAllImage = files.slice().every(file => file.preview)
        // if (noOfTextFields.some(item => item.description.trim() === '')) {
        //     setIsSnackBarOpen(true)
        //     return
        // } else 
        if (!id) {
            submitDemographicSummer({ formData, token })
        } else {
            formData.append('id', id)
            updateDemographicSummer({ formData, token })
        }
        //  else if (!isAllImage) {
        //     setImageFieldEmpty(true)
        //     setIsSnackBarOpen(true)
        // } 
    }, [useAddDemographicSummaryMutation, useUpdateDemographicSummaryMutation, title, noOfTextFields, files])

    useEffect(() => {
        if ((data !== undefined || updatedData !== undefined) && !saveContent) {
            dispatch(increment())
            router.push("/propertyDescription/propertySummary")
        } else if (data !== undefined) {
            setId(data._id)
        } else if (updatedData !== undefined) {
            setId(updatedData._id)
        }
        if (error !== undefined || updateError !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, updatedData, error, updateError, saveContent])

    useEffect(() => {
        if (demographicData !== undefined) {
            const newDescriptionArr = demographicData.descriptionArr.map(dsc =>
                ({ description: dsc })
            )
            executiveSummarySteps[2].completed = demographicData.isStepCompleted
            setNoOfTextFields(newDescriptionArr)
            setTitle(demographicData.title)
            setId(demographicData._id)
            if (demographicData.images.length > 0) {
                setFiles(demographicData.images.map(item => ({ preview: item })))
            }
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === executiveSummarySteps[2].label) {
                    item.completed = demographicData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [demographicData])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={"100%"}
            title={"Executive Summary"}
            insideSteps={executiveSummarySteps}
            stepCount={stepCount}
            handleSubmit={handleSubmit}
            setSaveContent={setSaveContent}
            isLoading={id ? updating : isLoading}
            goBackRoute={'/executiveSummary/investmentOppurtunity'}
        >
            {getting ?
                <Box sx={{
                    display: "flex", height: "50vh", justifyContent: "center",
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
                                    style={{ fontFamily: "Poppins" }}
                                />
                            }
                            {/* <HtmlTooltip
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                                title={<Fragment>
                                    <Image
                                        src={summaryPreview}
                                        style={{ borderRadius: 5 }}
                                        height={300}
                                        width={300}
                                        alt="no image"
                                    />
                                </Fragment>}
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
                    </Box>
                    {noOfTextFields.map((item, idx) =>
                        <Box key={idx} sx={{
                            position: "relative",
                            mt: noOfTextFields.length > 1 && idx !== 0 ? 4 : 2
                        }}>
                            <textarea className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-100 rounded-md px-2 py-2 font-normal'
                                style={{ fontFamily: "Poppins" }}
                                placeholder="Enter Demographic Summar"
                                type="text"
                                name='description'
                                value={item.description}
                                onChange={e => handleChange(idx, e)}
                                rows='5'
                                cols='50'
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
                    <Box sx={{
                        width: "100%", display: "flex", mt: 1,
                        justifyContent: "space-between", alignItems: "center"
                    }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant='subtitle1'
                                sx={{ fontFamily: "Poppins", width: 100 }}>
                                Images
                            </Typography>
                        </Box>
                        {/* <Box
                            aria-haspopup="true"
                            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                            onClick={() => setFiles([...files, {}])}>
                            <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                            <Typography variant='subtitle2'
                                sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>Add New</Typography>
                        </Box> */}
                    </Box>
                    <Grid container component="main" sx={{ background: "#fff", position: "relative", cursor: "pointer" }}>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <FileUploadOutlinedIcon
                                sx={{ width: 30, height: 30, color: "#989898" }}
                            />
                            <Typography variant='subtitle2'
                                sx={{
                                    color: "#989898", fontFamily: "Poppins", mt: 1,
                                    fontSize: 12
                                }}>
                                Upload Image
                            </Typography>
                            <Typography variant='subtitle2'
                                sx={{ color: "#989898", fontFamily: "Poppins", fontSize: 12 }}>
                                400 * 400
                            </Typography>
                        </div>
                        {imageArr}
                    </Grid>
                    <Box
                        aria-haspopup="true"
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer", mt: 4 }}
                        onClick={() =>
                            setNoOfTextFields(prev => [...prev, { description: '' }])}>
                        <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                        <Typography variant='subtitle2'
                            sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>Add New</Typography>
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
                    {error !== undefined ? error.data?.message
                        : 'You must enter first summary description'}
                </Alert>
            </Snackbar>
            <PreviewModal wrapperComponent={PreviewChild}
                open={open} handleClose={handleClose}
            // imgSrc={demographicPreview} 
            />
        </LogiCLoseLayout>
    );
}

export default IsAuthHOC(DemographicSummary, "/executiveSummary/demographicSummary");
