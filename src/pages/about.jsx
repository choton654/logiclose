import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, Paper, Grid, CircularProgress, Snackbar, Alert, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import dynamic from "next/dynamic"
import Loader from '../components/Loader';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import IsAuthHOC from '../components/IsAuthHOC';
import { dropzoneStyle } from '../utils/dropzoneStyle';
import { useAddAboutMutation, useGetAboutQuery } from '../services/query';
import { getData } from '../utils/localStorage';
import { animateScroll } from "react-scroll"
import CircularProgressWithLabel from '../components/CircularLoader';

const LogiCLoseLayout = dynamic(
    () => import("../components/LogiCLoseLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const aboutStep = [
    {
        label: 'About',
        completed: false,
        route: "/about"
    },
]

const About = ({ dimension }) => {

    const router = useRouter()
    const token = getData('token')
    const [stepCount, setStepCount] = useState(0)
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    const [files, setFiles] = useState([])
    const [about, setAbout] = useState('')
    const [fileIndex, setFileIndex] = useState(0)
    const [contactData, setContactData] = useState([{
        name: '',
        email: '',
        contact: '',
        images: [],
        noOfNewFiles: 0
    }])
    const [textFieldEmpty, setTextFieldEmpty] = useState(false)
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)

    const closeSnackBar = () => {
        setTextFieldEmpty(false)
        setIsSnackBarOpen(false)
    }

    const removeContact = (idx) => {
        const newContact = [...contactData]
        // newContact[idx] = undefined
        newContact.splice(idx, 1)
        setContactData(newContact)
    }

    const handleChange = useCallback((idx, text, type) => {
        const newFIelds = [...contactData]
        newFIelds[idx][type] = text
        setContactData(newFIelds)
    }, [contactData])

    const style = useMemo(() => dropzoneStyle, [])

    const { getRootProps, getInputProps } = useDropzone({
        // maxFiles: 1,
        accept: { 'image/*': [] },
        multiple: true,
        onDrop: acceptedFiles => setFiles(acceptedFiles)
    })

    const removeImages = (idx, imgidx) => {
        const newContactData = [...contactData]
        newContactData[idx].images[imgidx].preview = undefined
        setContactData(newContactData)
    }

    useEffect(() => {
        if (files.length > 0) {
            const newFIelds = [...contactData]
            newFIelds[fileIndex].images = [...newFIelds[fileIndex].images, ...files.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))]
            // newFIelds[fileIndex].noOfFiles = files.length
            if (id && (newFIelds[fileIndex].noOfFiles !== undefined || newFIelds[fileIndex].noOfFiles === 0)
                && newFIelds[fileIndex].noOfNewFiles !== 0) {
                newFIelds[fileIndex].noOfFiles += newFIelds[fileIndex].images.length
            } else {
                newFIelds[fileIndex].noOfNewFiles += files.length
            }
            setContactData(newFIelds)
        }
    }, [fileIndex, files])

    useEffect(() => {
        if (contactData.length > 0) {
            setFiles([])
        }
    }, [contactData])

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    const [submitAbout, { isLoading, error, data }] = useAddAboutMutation()
    const { data: aboutData, isLoading: getting } = useGetAboutQuery(token)

    const handleSubmit = useCallback(() => {
        let formData = new FormData()
        formData.append('about', about)
        formData.append('names', JSON.stringify(contactData.map(text => text.name)))
        formData.append('emails', JSON.stringify(contactData.map(text => text.email)))
        formData.append('contacts', JSON.stringify(contactData.map(text => text.contact)))
        formData.append('noOfFiles', JSON.stringify(contactData.map(text => text.noOfFiles)))
        formData.append('noOfNewFiles', JSON.stringify(contactData.map(text => text.noOfNewFiles)))

        let newImg = []
        contactData.forEach(item => {
            item.images.forEach(file => {
                if (file.preview !== undefined && file.name !== undefined) {
                    formData.append('uploads', file)
                } else {
                    newImg.push(file.preview)
                }
            })
        })
        formData.append('otherImages', JSON.stringify(newImg))
        const isEmptySubtitle = contactData.some(item =>
            item.name.trim() === '' || item.email.trim() === '' || item.contact.trim() === '')
        // const isEmptySubtitleText = locationSummary.some(item => item.subTitleText.trim() === '')
        if (isEmptySubtitle) {
            setTextFieldEmpty(true)
            setIsSnackBarOpen(true)
            return
        }
        if (id) {
            formData.append('id', id)
        }
        submitAbout({ formData, token })

    }, [useAddAboutMutation, about, contactData])

    useEffect(() => {
        if (aboutData !== undefined) {
            setContactData(aboutData.contacts.map(item => ({
                name: item.name,
                email: item.email,
                contact: item.contact,
                images: item.images.map(img => ({ preview: img })),
                noOfFiles: item.images.length,
                noOfNewFiles: 0
            })))
            aboutStep[0].completed = aboutData.isStepCompleted
            setAbout(aboutData.about)
            setId(aboutData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
        }
    }, [aboutData])

    useEffect(() => {
        if (data !== undefined) {
            if (!saveContent) {
                setStepCount(prevStep => prevStep + 1)
                router.push("/webView/executiveSummary")
            } else {
                setId(data._id)
            }
        }
        if (error !== undefined) {
            setIsSnackBarOpen(true)
        }
    }, [data, error, saveContent])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={isMobileDevice() || contactData.length > 1 ? "100%" : "110vh"}
            title={"About"}
            insideSteps={aboutStep}
            stepCount={stepCount}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            setSaveContent={setSaveContent}
            goBackRoute={'/exitScenarios/saleScenario'}
        >
            <Paper sx={{
                display: "flex", width: "100%", height: 250, my: 3,
                boxShadow: "0 0 20px 5px #e2e8f0", p: 2, flexDirection: "column"
            }}>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant='subtitle1'
                            sx={{ fontFamily: "Poppins" }}>About</Typography>
                        {/* <svg style={{ marginLeft: 10 }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                        </svg> */}
                    </Box>
                    {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                        <Typography variant='subtitle2'
                            sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>Add New</Typography>
                    </Box> */}
                </Box>
                <textarea className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-100 rounded-md px-2 py-2 font-normal'
                    style={{ fontFamily: "Poppins", width: "100%", height: "80%" }}
                    placeholder="Sed enim eget integer nulla et. Neque, diam diam, egestas leo, curabitur urna aliquet egestas massa. Quisque sit nulla quis pulvinar
                                suspendisse. Semper at interdum enim purus purus non. Aliquam iaculis et dictumst vitae, varius. Tristique volutpat varius imperdiet nulla
                                morbi fusce ullamcorper nibh. Tortor amet neque mattis dolor facilisi enim vestibulum sit. Iaculis amet sed faucibus et dictum arcu
                                purus mi. Varius eu aliquam lorem neque, nunc. Faucibus lacinia donec imperdiet metus, rhoncus, posuere senectus. Sed enim eget
                                integer nulla et. Neque, diam diam, egestas leo, curabitur urna aliquet egestas massa. Quisque sit nulla quis pulvinar
                                suspendisse. Semper at interdum enim purus purus non. Aliquam iaculis et dictumst vitae, varius. Tristique volutpat varius imperdiet nulla
                                morbi fusce ullamcorper nibh. Tortor amet neque mattis dolor facilisi enim vestibulum sit. Iaculis amet sed faucibus et dictum arcu
                                purus mi. Varius eu aliquam lorem neque, nunc. Faucibus lacinia donec imperdiet metus, rhoncus, posuere senectus."
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows='5'
                    cols='50'
                />
            </Paper>
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
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant='subtitle1'
                                sx={{ fontFamily: "Poppins" }}>Contact</Typography>
                            {/* <svg style={{ marginLeft: 10 }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
                        </svg> */}
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
                    {contactData.map((item, idx) =>
                        <Box key={idx} sx={{ position: "relative" }}>
                            <Box sx={{ display: "flex", width: "100%", mt: 1, justifyContent: "space-between" }}>
                                <Box sx={{ width: "30%" }}>
                                    <Typography variant='subtitle2' sx={{ fontFamily: "Poppins", fontSize: 13 }}>
                                        Name
                                    </Typography>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder='Name'
                                        size='small'
                                        type="text"
                                        name='name'
                                        value={item.name}
                                        onChange={(e) =>
                                            handleChange(idx, e.target.value, e.target.name)}
                                        style={{ width: "100%", fontSize: 13, marginTop: 2, fontFamily: "Poppins" }}
                                    />
                                </Box>
                                <Box sx={{ width: "30%" }}>
                                    <Typography variant='subtitle2' sx={{ fontFamily: "Poppins", fontSize: 13 }}>
                                        Email
                                    </Typography>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder='Email'
                                        size='small'
                                        type="text"
                                        name='email'
                                        value={item.email}
                                        onChange={(e) =>
                                            handleChange(idx, e.target.value, e.target.name)}
                                        style={{ width: "100%", fontSize: 13, marginTop: 2, fontFamily: "Poppins" }}
                                    />
                                </Box>
                                <Box sx={{ width: "30%" }}>
                                    <Typography variant='subtitle2' sx={{ fontFamily: "Poppins", fontSize: 13 }}>
                                        Contact
                                    </Typography>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder='Contact'
                                        size='small'
                                        type="text"
                                        name='contact'
                                        value={item.contact}
                                        onChange={(e) =>
                                            handleChange(idx, e.target.value, e.target.name)}
                                        style={{ width: "100%", fontSize: 13, marginTop: 2, fontFamily: "Poppins" }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Typography variant='subtitle1'
                                    sx={{
                                        fontFamily: "Poppins", fontSize: 13,
                                        width: dimension && dimension.innerWidth > 600 ? 200 : 100
                                    }}>
                                    Images
                                </Typography>
                                <Box sx={{ width: "100%", display: "flex", background: "#fff", cursor: 'pointer' }}>
                                    <Grid container component="main"
                                        sx={{ background: "#fff", mt: idx !== 0 ? 1 : 0 }}>
                                        <div {...getRootProps({
                                            style,
                                            onClick: () => setFileIndex(idx)
                                        })}>
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
                                        {item.images.map((image, imgidx) =>
                                            image && image.preview !== undefined &&
                                            <Grid className='transform hover:-translate-x hover:scale-110'
                                                key={imgidx}
                                                item
                                                xs={5}
                                                sm={3}
                                                md={2}
                                                sx={{
                                                    position: "relative",
                                                    mt: 1,
                                                    display: "flex", mx: 1,
                                                    height: 125,
                                                    width: 125,
                                                }}
                                                component={Paper}
                                                elevation={2}
                                            >
                                                <img
                                                    src={image.preview}
                                                    style={{
                                                        display: 'block',
                                                        borderRadius: 5,
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                    onLoad={() => { URL.revokeObjectURL(image.preview) }}
                                                    alt={`img${imgidx}`}
                                                />
                                                <svg onClick={() => removeImages(idx, imgidx)}
                                                    style={{
                                                        position: "absolute",
                                                        top: 5, right: 5, width: 15, height: 15,
                                                        color: "red", cursor: "pointer"
                                                    }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                                </svg>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>
                            </Box>
                            {idx !== 0 &&
                                <svg
                                    onClick={() => removeContact(idx)}
                                    style={{
                                        position: "absolute",
                                        top: 5, right: 5, width: 15, height: 15,
                                        color: "red", cursor: "pointer"
                                    }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                </svg>
                            }
                        </Box>
                    )}
                    <Box onClick={() => {
                        setContactData(prev => [...prev, {
                            name: '',
                            email: '',
                            contact: '',
                            images: [],
                            noOfNewFiles: 0
                        }])
                        animateScroll.scrollToBottom({
                            duration: 500,
                            delay: 100,
                            smooth: true,
                        })
                    }
                    } sx={{ display: "flex", alignItems: "center", cursor: 'pointer' }}>
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
                    {error !== undefined ? error.data?.message :
                        textFieldEmpty ? "Text field can't be empty"
                            : 'You must enter first summary description'}
                </Alert>
            </Snackbar>
        </LogiCLoseLayout>
    );
}
export default IsAuthHOC(About, "/about");
