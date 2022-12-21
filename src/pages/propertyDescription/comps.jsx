import React, { useCallback, useEffect, useState, useMemo, Fragment } from 'react';
import {
    Box, Typography, TextField, Snackbar, Alert, Paper,
    Divider, Grid, CircularProgress, Fade, Button
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Autocomplete from "react-google-autocomplete";
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/WebView/CompsPreview.png"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import dynamic from "next/dynamic"
import Image from "next/image"
import Loader from '../../components/Loader';
import { useDropzone } from 'react-dropzone';
import { propertySumarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import mapLogo from "../../../public/icons/map.png"
import { getData, storeData } from '../../utils/localStorage';
import { useAddCompsMutation, useGetCompsQuery } from '../../services/query';
import IsAuthHOC from '../../components/IsAuthHOC';
import PreviewModal from '../../components/PreviewModal';
import compsDemo1 from "../../../public/assets/summary1.png"
import compsDemo2 from "../../../public/assets/summary2.png"
import compsDemo3 from "../../../public/assets/summary3.png"
import compsDemo4 from "../../../public/assets/summary4.png"
import compsPreview1 from "../../../public/WebView/CompsPreview1.png"
import compsPreview2 from "../../../public/WebView/CompsPreview2.png"
import compsPreview3 from "../../../public/WebView/CompsPreview3.png"
import compsPreview4 from "../../../public/WebView/CompsPreview4.png"
import compsPreview5 from "../../../public/WebView/CompsPreview5.png"
import compsPreview6 from "../../../public/WebView/CompsPreview6.png"
import compsPreview7 from "../../../public/WebView/CompsPreview7.png"

const GOOGLE_MAP_API_KEY = ''

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
    <Box className='flex flex-col px-8 py-4 w-[80%] ml-auto mr-auto'>
        <Box className='flex flex-row justify-between cursor-pointer z-10'>
            <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                Comps
            </Typography>
            <Typography variant='subtitle1' sx={{
                textDecorationLine: "underline", color: "#F27A30",
                fontWeight: 400, fontFamily: "Poppins",
                cursor: 'pointer', mr: 4
            }}>
                Property Comperison
            </Typography>
        </Box>
        <Box className='flex flex-col mt-6'>
            <Box className='flex flex-col justify-between'>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                        Comps 1
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins", width: "80%" }}>
                        Sem nunc magna viverra sed. Lacinia hac vestibulum                    </Typography>
                </Box>
                <Box className='flex flex-row mt-3 flex-wrap items-center'>
                    <Box sx={{ mr: 2, width: 180 }}>
                        <Image src={compsPreview1} />
                    </Box>
                    <Box sx={{ mr: 2, width: 180 }}>
                        <Image src={compsPreview2} />
                    </Box>
                    <Box sx={{ mr: 2, width: 180 }}>
                        <Image src={compsPreview3} />
                    </Box>
                    <Box sx={{ mr: 2, width: 180 }}>
                        <Image src={compsPreview4} />
                    </Box>
                </Box>
            </Box>
            <Box className='flex flex-row mt-2'>
                <Box className='flex flex-col justify-between'>
                    <Box>
                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                            Comps 2
                        </Typography>
                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins", width: "80%" }}>
                            Sem nunc magna viverra sed. Lacinia hac vestibulum                    </Typography>
                    </Box>
                    <Box className='flex flex-row mt-3 flex-wrap items-center'>
                        <Box sx={{ mr: 2, width: 180 }}>
                            <Image src={compsPreview5} />
                        </Box>
                        <Box sx={{ mr: 2, width: 180 }}>
                            <Image src={compsPreview6} />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: 380 }}>
                    <Image src={compsPreview7} />
                </Box>
            </Box>
        </Box>
    </Box>

const SubComps = ({ index, comps,
    handleCompTextChange, getRootProps, setFileIndex,
    getInputProps, dropzoneStyle, removeTextField,
    toggleLabel, handleLabelChange, isSubTitleEdit,
    subTitleId, setGoogleAddress, handleMapOpen,
    setGoogleAddressIndex, addCompsData }) => {

    return (
        <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
                mt: index > 1 ? 2 : 0,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                borderRadius: 2, alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Box sx={{
                height: "100%", display: "flex", width: "95%",
                flexDirection: "column", justifyContent: "space-between",
                borderWidth: 2, px: 2, pt: 1, pb: 2, borderRadius: 2
            }}>
                {comps.label !== undefined &&
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {isSubTitleEdit && index === subTitleId ?
                                        <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] rounded-md px-2 font-normal'
                                            placeholder="Enter title"
                                            type="text"
                                            size='small'
                                            value={comps.label}
                                            onChange={(e) =>
                                                handleLabelChange(index, e.target.value)}
                                            style={{ width: 100, fontSize: 13, fontFamily: "Poppins" }}
                                        />
                                        :
                                        <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                                            {comps.label.slice(0, 30)} {comps.label.length > 30 && '...'}
                                        </Typography>
                                    }
                                    <svg onClick={() => toggleLabel(index)} style={{ cursor: "pointer", marginLeft: 5 }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.29199 8.25005H4.23533C4.29565 8.2504 4.35544 8.23884 4.41128 8.21603C4.46712 8.19322 4.51792 8.15962 4.56074 8.11714L7.73241 4.94089L9.03408 3.66672C9.07703 3.62411 9.11113 3.57342 9.1344 3.51757C9.15767 3.46172 9.16965 3.40181 9.16965 3.3413C9.16965 3.2808 9.15767 3.22089 9.1344 3.16504C9.11113 3.10919 9.07703 3.0585 9.03408 3.01589L7.09074 1.04964C7.04813 1.00668 6.99744 0.97258 6.94159 0.949312C6.88574 0.926043 6.82583 0.914062 6.76533 0.914062C6.70482 0.914063 6.64491 0.926043 6.58906 0.949312C6.53321 0.97258 6.48252 1.00668 6.43991 1.04964L5.14741 2.34672L1.96658 5.52297C1.9241 5.5658 1.89049 5.61659 1.86768 5.67243C1.84487 5.72827 1.83331 5.78807 1.83366 5.84839V7.79172C1.83366 7.91328 1.88195 8.02986 1.9679 8.11581C2.05386 8.20177 2.17043 8.25005 2.29199 8.25005ZM6.76533 2.0213L8.06241 3.31839L7.41158 3.96922L6.11449 2.67214L6.76533 2.0213ZM2.75033 6.0363L5.46824 3.31839L6.76533 4.61547L4.04741 7.33339H2.75033V6.0363ZM9.62533 9.16672H1.37533C1.25377 9.16672 1.13719 9.21501 1.05123 9.30096C0.965281 9.38692 0.916992 9.5035 0.916992 9.62505C0.916992 9.74661 0.965281 9.86319 1.05123 9.94915C1.13719 10.0351 1.25377 10.0834 1.37533 10.0834H9.62533C9.74688 10.0834 9.86346 10.0351 9.94942 9.94915C10.0354 9.86319 10.0837 9.74661 10.0837 9.62505C10.0837 9.5035 10.0354 9.38692 9.94942 9.30096C9.86346 9.21501 9.74688 9.16672 9.62533 9.16672Z" fill="#3E4A3D" />
                                    </svg>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Image
                                    src={mapLogo}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setGoogleAddressIndex(index)
                                        handleMapOpen()
                                    }}
                                    height={20}
                                    width={20}
                                    alt="no image"
                                />
                                {index > 0 &&
                                    <svg onClick={() => removeTextField(index)} style={{ marginLeft: 20, cursor: "pointer" }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                    </svg>
                                }
                            </Box>
                        </Box>
                        <Autocomplete
                            apiKey={GOOGLE_MAP_API_KEY}
                            onPlaceSelected={(place) => {
                                setGoogleAddressIndex(index)
                                setGoogleAddress(place.formatted_address)
                            }}
                            options={{
                                types: ['address']
                            }}
                            defaultValue={comps.compText}
                            value={comps.compText}
                            onChange={(e) =>
                                handleCompTextChange(index, e.target.value)}
                            className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                            style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                        />
                        {/* <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                            placeholder='Comps'
                            size="small"
                            type="text"
                            onChange={(e) =>
                                handleCompTextChange(index, e.target.value)}
                            value={comps.compText}
                            style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                        /> */}
                    </Box>
                }

                {comps.compData.map((item, compDataid) =>
                    <Box key={compDataid} className='flex flex-row justify-between mt-3'>
                        {item.bedRoomCount !== undefined &&
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                                        Bedrooms
                                    </Typography>
                                </Box>
                                <input className='w-[80%] mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    placeholder='Bedrooms'
                                    size="small"
                                    type="number"
                                    onChange={(e) =>
                                        handleCompTextChange(index, e.target.value, 'bedRoomCount', compDataid)}
                                    value={item.bedRoomCount}
                                    style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                                />
                            </Box>
                        }
                        {item.bathRoomCount !== undefined &&
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                                        Bathrooms
                                    </Typography>
                                </Box>
                                <input className='w-[80%] mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    placeholder='Bathrooms'
                                    size="small"
                                    type="number"
                                    onChange={(e) =>
                                        handleCompTextChange(index, e.target.value, 'bathRoomCount', compDataid)}
                                    value={item.bathRoomCount}
                                    style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                                />
                            </Box>
                        }
                        {item.avgRent !== undefined &&
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                                        Avg Rent ($)
                                    </Typography>
                                </Box>
                                <input className='w-[80%] mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    placeholder='Avg Rent'
                                    size="small"
                                    type="number"
                                    onChange={(e) =>
                                        handleCompTextChange(index, e.target.value, 'avgRent', compDataid)}
                                    value={item.avgRent}
                                    style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                                />
                            </Box>
                        }
                        {item.sqrFeet !== undefined &&
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                                        Square Feet
                                    </Typography>
                                </Box>
                                <input className='w-[90%] mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                    placeholder='Square Feet'
                                    size="small"
                                    type="number"
                                    onChange={(e) =>
                                        handleCompTextChange(index, e.target.value, 'sqrFeet', compDataid)}
                                    value={item.sqrFeet}
                                    style={{ marginTop: 2, fontSize: 13, fontFamily: "Poppins" }}
                                />
                            </Box>
                        }
                    </Box>
                )}
                <Box
                    aria-haspopup="true"
                    sx={{ my: 2, display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => addCompsData(index)}>
                    <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
                    <Typography variant='subtitle2'
                        sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>
                        Add New
                    </Typography>
                </Box>
                <Box sx={{ mt: 1, cursor: "pointer" }}>
                    <Typography variant='subtitle2' sx={{ fontSize: 13, fontFamily: "Poppins" }}>
                        Images
                    </Typography>
                    <Grid container component="main" sx={{ background: "#fff" }}>
                        <div {...getRootProps({
                            style: dropzoneStyle,
                            onClick: () => setFileIndex(index)
                        })}>
                            <input {...getInputProps()} />
                            <FileUploadOutlinedIcon
                                sx={{ width: 30, height: 30, color: "#989898" }}
                            />
                            <Typography variant='subtitle2'
                                sx={{
                                    color: "#989898", fontFamily: "Poppins", mt: 1,
                                    fontSize: 12, textAlign: "center"
                                }}>
                                Upload Image
                            </Typography>
                            <Typography variant='subtitle2'
                                sx={{ color: "#989898", fontFamily: "Poppins", fontSize: 12 }}>
                                400 * 400
                            </Typography>
                        </div>
                        {comps.images.map((image, idx) =>
                            <Grid className='transform hover:-translate-x hover:scale-110'
                                key={idx}
                                item
                                xs={5}
                                sm={3}
                                md={3}
                                sx={{
                                    mt: 1,
                                    display: "flex", ml: 2,
                                    height: 110,
                                    width: 135,
                                }}
                                component={Paper}
                            >
                                {image.preview !== undefined &&
                                    <img
                                        src={image.preview}
                                        style={{
                                            display: 'block',
                                            borderRadius: 5,
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        onLoad={() => { URL.revokeObjectURL(image.preview) }}
                                        alt={`img${idx}`}
                                    />
                                }
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
        </Grid>
    )
}

const Comps = ({ dimension }) => {

    const location = JSON.parse(getData('userLocation'))
    const router = useRouter()
    const token = getData('token')
    const [stepCount, setStepCount] = useState(4)
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    const [title, setTitle] = useState('Comps')
    const [fileIndex, setFileIndex] = useState(0)
    const [files, setFiles] = useState([])
    const [isFileLimit, setIsFileLimit] = useState(false)
    const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [subTitleId, setSubtitleId] = useState(0)
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const [isFieldEmpty, setisFieldEmpty] = useState(false)
    const [coords, setCoords] = useState(null)
    const [googleAddress, setGoogleAddress] = useState('')
    const [comps, setComps] = useState([{
        label: 'Label 1',
        compText: '',
        compData: [{
            bedRoomCount: '',
            bathRoomCount: '',
            avgRent: '',
            sqrFeet: '',
        }],
        images: [],
        noOfNewFiles: 0
    }])
    console.log('comps', comps);
    const [googleAddressIndex, setGoogleAddressIndex] = useState(0)
    const [mapOpen, setMapOpen] = useState(false)
    const handleMapOpen = () => setMapOpen(true);
    const handleMapClose = () => setMapOpen(false);

    const [previewopen, setPreviewOpen] = useState(false)
    const handlePreviewOpen = () => setPreviewOpen(true);
    const handlePreviewClose = () => setPreviewOpen(false);

    const { getRootProps, getInputProps } = useDropzone({
        // maxFiles: 1,
        accept: { 'image/*': [] },
        multiple: true,
        onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    })

    useEffect(() => {
        if (files.length > 0) {
            if (files.length < 2) {
                const newFIelds = [...comps]
                newFIelds[fileIndex].images = [...files.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))]

                if (id && (newFIelds[fileIndex].noOfFiles === undefined || newFIelds[fileIndex]._id)) {
                    newFIelds[fileIndex].noOfNewFiles = files.length
                    newFIelds[fileIndex].noOfFiles = 0
                } else {
                    newFIelds[fileIndex].noOfNewFiles = newFIelds[fileIndex].images.length
                }
                setComps(newFIelds)
                setIsFileLimit(false)
            } else {
                setIsFileLimit(true)
                setIsSnackBarOpen(true)
            }
        }
    }, [fileIndex, files])

    useEffect(() => {
        if (comps.length > 0) {
            setFiles([])
        }
    }, [comps])

    const closeSnackBar = () => {
        setisFieldEmpty(false)
        setIsSnackBarOpen(false)
    }

    const style = useMemo(() => ({
        display: "flex", marginTop: 8,
        height: 110, width: 135, borderRadius: 5,
        boxShadow: '0px 2px 5px 2px #eeeeee',
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    }), [])

    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Comps')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const toggleLabel = (idx) => {
        if (comps[idx]['label'].trim() === '') {
            const newFIelds = [...comps]
            newFIelds[idx]['label'] = 'Label'
            setComps(newFIelds)
        }
        setSubtitleId(idx)
        setTimeout(() => {
            if (idx === subTitleId) {
                setIsSubTitleEdit(!isSubTitleEdit)
            }
        }, 20)
    }

    const addCompsData = (index) => {
        const newComps = [...comps]
        if (newComps[index].compData.length <= 4) {
            newComps[index].compData = [...newComps[index].compData, {
                bedRoomCount: '',
                bathRoomCount: '',
                avgRent: '',
                sqrFeet: '',
            }]
        }
        setComps(newComps)
    }

    const handleLabelChange = (index, text) => {
        const newFIelds = [...comps]
        newFIelds[index]['label'] = text
        setComps(newFIelds)
    }

    const handleCompTextChange = (index, text, extra, compDataid) => {
        const newFIelds = [...comps]
        if (extra !== undefined) {
            if (extra === 'avgRent') {
                newFIelds[index].compData[compDataid]['avgRent'] = text
            } else if (extra === 'sqrFeet') {
                newFIelds[index].compData[compDataid]['sqrFeet'] = text
            } else if (extra === 'bedRoomCount') {
                newFIelds[index].compData[compDataid]['bedRoomCount'] = text
            } else {
                newFIelds[index].compData[compDataid]['bathRoomCount'] = text
            }
        } else {
            newFIelds[index]['compText'] = text
        }
        setComps(newFIelds)
    }

    const removeTextField = useCallback((index) => {
        const newFieldsData = [...comps]
        newFieldsData.splice(index, 1)
        // .map((fld, idx) => {
        //     if (idx === index) {
        //         fld.label = undefined
        //         fld.compText = undefined
        //         return fld
        //     } else {
        //         return fld
        //     }
        // })
        setComps(newFieldsData)
    }, [comps])

    const { data: compsData, isLoading: getting, error: compserror } = useGetCompsQuery(token)
    const [submitComps, { data, isLoading, error }] = useAddCompsMutation()

    const handleSubmit = useCallback(() => {
        let formData = new FormData()
        formData.append('title', title)
        formData.append('compDataArr', JSON.stringify(comps.map(text => text.compData)))
        // formData.append('avgRentArr', JSON.stringify(comps.map(text => text.avgRent)))
        // formData.append('sqrFeetArr', JSON.stringify(comps.map(text => text.sqrFeet)))
        formData.append('labelArr', JSON.stringify(comps.map(text => text !== undefined && text.label)))
        formData.append('comptextArr', JSON.stringify(comps.map(text => text !== undefined && text.compText)))
        formData.append('noOfNewFiles', JSON.stringify(comps.map(text => text.noOfNewFiles)))
        formData.append('noOfFiles', JSON.stringify(comps.map(text => text.noOfFiles)))

        let otherImages = []
        comps.forEach(item => {
            item.images.forEach(file => {
                if (file.preview !== undefined && file.name !== undefined) {
                    formData.append('uploads', file)
                } else {
                    otherImages.push(file.preview)
                }
            })
        })
        formData.append('otherImages', JSON.stringify(
            otherImages.every(item => !item) ? [] : otherImages
        ))

        if (comps[0].compData[0].avgRent === '' || comps[0].compData[0].sqrFeet === '' ||
            comps[0].compData[0].bedRoomCount === '' || comps[0].compData[0].bathRoomCount === '') {
            setisFieldEmpty(true)
            setIsSnackBarOpen(true)
            return
        }
        // console.log(comps);
        if (id) {
            formData.append('id', id)
        }
        submitComps({ formData, token })

    }, [useAddCompsMutation, comps, files])

    useEffect(() => {
        if (compsData !== undefined) {
            setComps(compsData.comps.map((item, idx) => ({
                label: item.label !== undefined ? item.label : undefined,
                compText: item.compText !== undefined ? item.compText : undefined,
                compData: item.compData.map((cd) => ({
                    avgRent: cd.avgRent !== undefined ? cd.avgRent : '',
                    sqrFeet: cd.sqrFeet !== undefined ? cd.sqrFeet : '',
                    bedRoomCount: cd.bedRoomCount !== undefined ? cd.bedRoomCount : 0,
                    bathRoomCount: cd.bathRoomCount !== undefined ? cd.bathRoomCount : 0
                })),
                images: item.images.map(img => ({ preview: img })),
                noOfFiles: item.images.length,
                noOfNewFiles: 0,
                _id: item._id
            })))

            setTitle(compsData.title)
            propertySumarySteps[4].completed = compsData.isStepCompleted
            setId(compsData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === propertySumarySteps[4].label) {
                    item.completed = compsData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }

    }, [compsData])

    useEffect(() => {
        if (data !== undefined) {
            if (!saveContent) {
                setStepCount(prevStep => prevStep + 1)
                router.push("/locationOverView/locationSummary")
            } else {
                setId(data._id)
            }
        }
        if (error !== undefined) {
            console.log(error);
            // setIsSnackBarOpen(true)
        }
    }, [data, error])

    useEffect(() => {
        if (!location) {
            (async () => {
                const status = await navigator.permissions.query({ name: "geolocation" })
                navigator.geolocation.getCurrentPosition(({ coords, timestamp }) => {
                    setCoords({ latitude: coords.latitude, longitude: coords.longitude })
                    const userLocation = JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude })
                    storeData('userLocation', userLocation)
                }, ({ message }) => {
                    console.log(message);
                })
            })()
        } else {
            setCoords({ latitude: location.latitude, longitude: location.longitude })
            // storeData('userLocation', userLocation)
        }
    }, [])

    useEffect(() => {
        if (googleAddress) {
            handleCompTextChange(googleAddressIndex, googleAddress)
        }
    }, [googleAddress])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={comps.length > 0 ? "100%" : "100vh"}
            title={"Property Summary"}
            insideSteps={propertySumarySteps}
            stepCount={stepCount}
            handleSubmit={handleSubmit}
            setSaveContent={setSaveContent}
            isLoading={isLoading}
            goBackRoute={'/propertyDescription/floorPlans'}
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
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                                    focused={isTitleEdit}
                                    onBlur={toggleTitle}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: 180, fontFamily: "Poppins" }}
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
                                            height={200}
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
                            <svg onClick={toggleTitle} style={{ marginLeft: 5, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                    <Divider sx={{ mt: 1, mb: 2 }} />
                    <Grid container component="main"
                        sx={{ background: "#fff", backgroundColor: "#fff" }}>
                        {comps.map((item, index) =>
                            <Grid key={index} item xs={12} sm={6} md={6}>
                                <SubComps index={index}
                                    removeTextField={removeTextField}
                                    comps={item} setComps={setComps}
                                    handleCompTextChange={handleCompTextChange}
                                    handleLabelChange={handleLabelChange}
                                    dropzoneStyle={style}
                                    getRootProps={getRootProps}
                                    getInputProps={getInputProps}
                                    setFileIndex={setFileIndex}
                                    toggleLabel={toggleLabel}
                                    isSubTitleEdit={isSubTitleEdit}
                                    subTitleId={subTitleId}
                                    setGoogleAddress={setGoogleAddress}
                                    handleMapOpen={handleMapOpen}
                                    setGoogleAddressIndex={setGoogleAddressIndex}
                                    addCompsData={addCompsData}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Box
                        aria-haspopup="true"
                        sx={{ display: "flex", alignItems: "center", cursor: "pointer", mt: 4 }}
                        onClick={() => setComps(prev => [...prev,
                        {
                            label: `Label ${comps.length + 1}`,
                            compText: '',
                            compData: [{
                                bedRoomCount: '',
                                bathRoomCount: '',
                                avgRent: '',
                                sqrFeet: '',
                            }],
                            images: [],
                            noOfNewFiles: 0
                        }
                        ])}>
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
                        isFieldEmpty ? "Average rent and square feet must be added"
                            : 'You must enter first summary description'}
                </Alert>
            </Snackbar>
            {isFileLimit &&
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={3000}
                    open={isSnackBarOpen}
                    onClose={closeSnackBar}
                >
                    <Alert onClose={closeSnackBar} severity="error" sx={{ width: '100%' }}>
                        Only one picture is allowed for single comps
                    </Alert>
                </Snackbar>
            }
            <Map coords={coords} fieldIndex={googleAddressIndex}
                handleChange={handleCompTextChange}
                mapOpen={mapOpen} handleMapClose={handleMapClose} />
            <PreviewModal open={previewopen} handleClose={handlePreviewClose}
                wrapperComponent={PreviewChild} imgSrc={summaryPreview} />
        </LogiCLoseLayout>
    );
}
export default IsAuthHOC(Comps, "/propertyDescription/comps");
