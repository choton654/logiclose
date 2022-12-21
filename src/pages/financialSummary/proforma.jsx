import React, { useCallback, useEffect, useState, useMemo, Fragment } from 'react';
import {
    Box, Typography, Grid, Paper, Divider, Fade,
    TextField, Alert, Snackbar, CircularProgress, Button
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/WebView/ProformaPreview.png"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from "next/image"
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dynamic from "next/dynamic"
import { useDropzone } from 'react-dropzone';
import { dropzoneStyle } from '../../utils/dropzoneStyle';
import Loader from '../../components/Loader';
import { financialSummarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import noImageLogo from "../../../public/assets/No_image.jpg"
import { useAddPerformaMutation, useGetPerformaQuery } from '../../services/query';
import { getData, storeData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC';
import PreviewModal from '../../components/PreviewModal';
// import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'
import { read, utils } from 'xlsx';
import axios from 'axios';
import proforma from "../../../public/WebView/setrificate.png"
import proforma2 from "../../../public/WebView/proforma2.png"
import proforma3 from "../../../public/WebView/proforma3.png"
import CircularProgressWithLabel from '../../components/CircularLoader';

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

const PreviewChild = () => <Box className='flex flex-col w-[70%] ml-auto mr-auto my-4'>
    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
        Performa
    </Typography>
    <Box className='flex flex-row mt-6 pr-2' sx={{ width: "100%" }}>
        <Image src={proforma} height={440} width={330} />
        <Box className='flex flex-col' sx={{ ml: 2 }}>
            <Image src={proforma2} height={215} width={350} />
            <Box sx={{ mt: 3 }}>
                <Image src={proforma3} height={215} width={350} />
            </Box>
        </Box>
    </Box>
</Box>

const Performa = ({ dimension }) => {

    const router = useRouter()
    const token = getData('token')
    const [stepCount, setStepCount] = useState(3)
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    // const [fileIndex, setFileIndex] = useState(0)
    const [title, setTitle] = useState('Proforma')
    const [files, setFiles] = useState([]);
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [performaState, setPerformaState] = useState({
        images: [],
        noOfNewFiles: 0
    })
    const [isexcelIploading, setIsexcelIploading] = useState(false)
    const [excelFileUrls, setExcelFileUrls] = useState([])
    // const [rawExcelFiles, setRawExcelFIle] = useState([])
    const [excelDimenssion, setExcelDimenssion] = useState([])
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const closeSnackBar = () => {
        setIsSnackBarOpen(false)
    }

    const [isSnackBar2Open, setIsSnackBar2Open] = useState(false)
    const closeSnackBar2 = () => {
        setIsSnackBar2Open(false)
    }

    const [previewopen, setPreviewOpen] = useState(false)
    const handlePreviewOpen = () => setPreviewOpen(true);
    const handlePreviewClose = () => setPreviewOpen(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        onDrop: acceptedFiles => setFiles(acceptedFiles)
    })

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
        accept: {
            'application/pdf': ['.pdf', '.xlsx'],
        },
        onDrop: acceptedFiles => setFiles(acceptedFiles)
    })

    const removeImages = (idx) => {
        const newPerformaState = { ...performaState }
        // console.log(idx, newPerformaState.images);
        // if (newPerformaState.images[idx].name !== undefined) {
        //     newPerformaState.images.splice(idx, 1)
        // } else {
        // }
        newPerformaState.images[idx].preview = undefined
        setPerformaState(newPerformaState)
    }

    const removeExcelFile = (idx) => {
        // const newRawExcels = [...rawExcelFiles]
        const newExcelDimenssion = [...excelDimenssion]
        const newExcelFileUrls = [...excelFileUrls]
        newExcelDimenssion.splice(idx, 1)
        newExcelFileUrls.splice(idx, 1)
        setExcelDimenssion(newExcelDimenssion)
        setExcelFileUrls(newExcelFileUrls)

        // newRawExcels.splice(idx, 1)
        // newExcelDimenssion[idx].cols = []
        // newExcelDimenssion[idx].rows = []
        // setRawExcelFIle(newRawExcels)
    }

    useEffect(() => {
        if (files.length > 0) {
            const newFIelds = performaState
            const filetype = /jpeg|png|gif|jpg|pdf|xlsx/
            const isfileCheck = files.every((item) =>
                filetype.test(item.path.split('.')[item.path.split('.').length - 1]))
            if (!isfileCheck) {
                setIsSnackBar2Open(true)
            } else {
                const xlsxFiles = files.filter(item => item.path.split('.')[item.path.split('.').length - 1] === 'xlsx')
                if (xlsxFiles.length > 0) {
                    const xlFromdata = new FormData()
                    xlFromdata.append('file', xlsxFiles[0])
                    xlFromdata.append('upload_preset', "gatherAll")
                    xlFromdata.append('api_key', '224248336432978')
                    console.log('');
                    (async () => {
                        try {
                            setIsexcelIploading(true)
                            const { data } = await axios.post('https://api.cloudinary.com/v1_1/toton007/raw/upload', xlFromdata)
                            // const arayBuffer = await (await fetch(data.secure_url)).arrayBuffer()
                            // const wb = read(arayBuffer); // parse the array buffer
                            // const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
                            // const exceldata = utils.sheet_to_json(ws); // generate objects
                            // const rows = exceldata
                            // const colsData = exceldata.sort((a, b) => Object.keys(b).length - Object.keys(a).length)
                            // const cols = Object.keys(colsData[0]).map(item => (
                            //     { ...keyColumn(item, textColumn), title: item }
                            // ))
                            // setExcelDimenssion([...excelDimenssion, { cols, rows }]);
                            setExcelFileUrls([...excelFileUrls, data.secure_url])
                            setIsexcelIploading(false)
                        } catch (error) {
                            setIsexcelIploading(false)
                            console.log('excel error', error);
                        }
                    })()

                    // excel file setup
                    // ExcelRenderer(xlsxFiles[0], (err, resp) => {
                    //     if (err) {
                    //         console.log('excel error', err);
                    //     } else {
                    //         const cols = resp.cols.map(item => (
                    //             { ...keyColumn(item.name, textColumn), title: item.name }
                    //         ))
                    //         const rowsArr = []
                    //         resp.rows.forEach(item => {
                    //             if (Array.isArray(item) && item.length > 0) {
                    //                 const rowObj = {}
                    //                 cols.forEach((col, idx) => {
                    //                     rowObj[`${col.id}`] = item[idx]
                    //                 })
                    //                 rowsArr.push(rowObj)
                    //             }
                    //         })
                    //         setExcelDimenssion([...excelDimenssion, { cols, rows: rowsArr }]);
                    //         setRawExcelFIle([...rawExcelFiles, files[0]])
                    //     }
                    // });

                } else {
                    newFIelds.images = [...newFIelds.images, ...files.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    }))]
                    setPerformaState(newFIelds)
                }
                // if (id && newFIelds[fileIndex].noOfFiles !== undefined && newFIelds[fileIndex].noOfFiles === 0) {
                //     newFIelds[fileIndex].noOfFiles += newFIelds[fileIndex].images.length
                // } else {
                //     newFIelds[fileIndex].noOfNewFiles += files.length
                // }
            }
        }
    }, [files])

    useEffect(() => {
        if (performaState.images.length > 0) {
            setFiles([])
            // const images = [...performaState.images]
            // const proformaImages = images.filter((item, idx) => {
            //     if ((item.preview === undefined && item.path?.split('.')[item.path.split('.').length - 1] !== 'xlsx') ||
            //         (item.preview?.split('.')[item.preview.split('.').length - 1] !== 'xlsx')) {
            //         return item
            //     }
            // })
            // setProformaImages(proformaImages)
        }
    }, [performaState.images])
    // console.log('asd', performaState.images);
    const toggleTitle = () => {
        if (title.trim() === '') {
            setTitle('Proforma')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const style = useMemo(() => dropzoneStyle, [])

    const isMobileDevice = useCallback(() => {
        if (dimension.innerWidth < 600) { return true }
    }, [dimension])

    const [submitPerforma, { isLoading, data, error }] = useAddPerformaMutation()
    const { data: performaData, isLoading: getting } = useGetPerformaQuery(token)

    const handleSubmit = useCallback(async () => {
        let formData = new FormData()
        formData.append('title', title)
        // formData.append('noOfFiles', JSON.stringify(performaState.map(item => item.noOfFiles)))
        // formData.append('noOfNewFiles', JSON.stringify(performaState.map(item => item.noOfNewFiles)))

        let newImg = [...excelFileUrls]
        performaState.images.forEach(file => {
            // && file.path.split('.')[file.path.split('.').length - 1] !== 'xlsx'
            if (file.name !== undefined && file.preview !== undefined) {
                formData.append('uploads', file)
                // && !file.preview.startsWith('blob:')
            } else if (file.preview !== undefined) {
                newImg.push(file.preview)
            }
        })

        formData.append('otherImages', JSON.stringify(newImg))
        if (id) {
            formData.append('id', id)
        }
        submitPerforma({ formData, token })

        //  performaState.images.filter(file => file.path?.split('.')[file.path?.split('.').length - 1] === 'xlsx')
        // const excelFiles = rawExcelFiles.filter(item => typeof item !== 'string')
        // if (excelFiles.length > 0) {
        //     const uploadPromises = excelFiles.map(item => {
        //         const xlFromdata = new FormData()
        //         xlFromdata.append('file', item)
        //         xlFromdata.append('upload_preset', "gatherAll")
        //         xlFromdata.append('api_key', '224248336432978')
        //         return axios.post('https://api.cloudinary.com/v1_1/toton007/raw/upload', xlFromdata)
        //     })

        //     try {
        //         setIsexcelIploading(true)
        //         const resolvedPromises = await Promise.all(uploadPromises)
        //         if (resolvedPromises.length > 0) {
        //             resolvedPromises.forEach(item => {
        //                 newImg.push(item.data.secure_url)
        //             })
        //         }
        //         setIsexcelIploading(false)
        //         formData.append('otherImages', JSON.stringify(newImg))
        //         if (id) {
        //             formData.append('id', id)
        //         }
        //         submitPerforma({ formData, token })

        //     } catch (error) {
        //         setIsexcelIploading(false)
        //         console.log('cd error', error);
        //     }
        // } else {
        // }

    }, [useAddPerformaMutation, title, performaState, excelFileUrls])

    useEffect(() => {
        if (performaData !== undefined) {
            const proformaImages = performaData.performa.images.filter(item =>
                item.split('.')[item.split('.').length - 1] !== 'xlsx')
            const proformaExcels = performaData.performa.images.filter(item =>
                item.split('.')[item.split('.').length - 1] === 'xlsx')
            // if (proformaExcels.length > 0) {
            //     (async () => {
            //         try {
            //             const cdPromises = proformaExcels.map(async item => await (await fetch(item)).arrayBuffer())
            //             const resolvedarrayBufferPromises = await Promise.all(cdPromises)
            //             const rowColArr = resolvedarrayBufferPromises.map(item => {
            //                 const wb = read(item); // parse the array buffer
            //                 const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
            //                 const exceldata = utils.sheet_to_json(ws); // generate objects
            //                 const rows = exceldata
            //                 const colsData = exceldata.sort((a, b) => Object.keys(b).length - Object.keys(a).length)
            //                 const cols = Object.keys(colsData[0]).map(item => (
            //                     { ...keyColumn(item, textColumn), title: item }
            //                 ))
            //                 return { rows, cols }
            //             })
            //             setExcelDimenssion(rowColArr)
            //         } catch (error) {
            //             console.log(error);
            //         }
            //     })()
            // }

            setPerformaState({
                images: proformaImages.map(img => ({ preview: img }))
            })
            setExcelFileUrls(proformaExcels)
            // setRawExcelFIle(proformaExcels)
            // performaData.performa.map(item => ({
            // images: item.images.map(img => ({ preview: img })),
            // noOfFiles: item.images.length,
            // noOfNewFiles: 0
            financialSummarySteps[3].completed = performaData.isStepCompleted
            setTitle(performaData.title)
            setId(performaData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === financialSummarySteps[3].label) {
                    item.completed = performaData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [performaData])


    useEffect(() => {
        if (data !== undefined) {
            if (!saveContent) {
                setStepCount(prevStep => prevStep + 1)
                router.push("/exitScenarios/refinanceScenario")
            } else {
                setId(data._id)
            }
        }
        if (error !== undefined) {
            console.log('error', error);
            setIsSnackBarOpen(true)
        }
    }, [data, error, saveContent])

    return (
        <LogiCLoseLayout
            dimension={dimension}
            layoutHeight={isMobileDevice() || performaState.images.length > 4 ? "100%" : "100vh"}
            title={"Financial Summary"}
            insideSteps={financialSummarySteps}
            stepCount={stepCount}
            handleSubmit={handleSubmit}
            setSaveContent={setSaveContent}
            isLoading={isLoading}
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
                                    <svg onClick={toggleTitle} style={{ marginLeft: 5, cursor: 'pointer' }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <Divider sx={{ mt: 1, mb: 2 }} />
                            <Grid container component="main"
                                sx={{ background: "#fff", cursor: "pointer" }}>
                                <div {...getRootProps({
                                    style,
                                    // onClick: () => setFileIndex(idx)
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
                                <div {...getRootProps2({
                                    style: { ...style, marginLeft: 10 },
                                    // onClick: () => setFileIndex(idx)
                                })}>
                                    <input {...getInputProps2()} />
                                    <FileUploadOutlinedIcon
                                        sx={{ width: 30, height: 30, color: "#989898" }}
                                    />
                                    <Typography variant='subtitle2'
                                        sx={{
                                            color: "#989898", fontFamily: "Poppins", mt: 1,
                                            fontSize: 12
                                        }}>
                                        Upload File
                                    </Typography>
                                    <Typography variant='subtitle2'
                                        sx={{ color: "#989898", fontFamily: "Poppins", fontSize: 12 }}>
                                        400 * 400
                                    </Typography>
                                </div>
                                {performaState.images.map((image, index) =>
                                    image && image.preview !== undefined &&
                                    <Grid className='transform hover:-translate-x hover:scale-110'
                                        key={index}
                                        item
                                        xs={5}
                                        sm={3}
                                        md={2}
                                        sx={{
                                            display: 'flex', justifyContent: 'center',
                                            alignItems: 'center', position: "relative",
                                            mt: 1, display: "flex", mx: 1,
                                            borderColor: 'red',
                                            height: 125,
                                            width: 125,
                                        }}
                                        component={Paper}
                                        elevation={2}
                                    >
                                        {image.path && image.path.split('.')[image.path.split('.').length - 1] === 'pdf' ?
                                            // <iframe src={image.preview} style={{
                                            //     display: 'block',
                                            //     borderRadius: 5,
                                            //     width: '100%',
                                            //     height: '100%',
                                            //     cursor: 'pointer'
                                            // }} />
                                            <PictureAsPdfIcon sx={{ width: '60%', height: '60%', color: "#bdbdbd" }} />
                                            :
                                            image.preview.includes('.pdf') ?
                                                // <iframe src={image.preview} style={{
                                                //     display: 'block',
                                                //     borderRadius: 5,
                                                //     width: '100%',
                                                //     height: '100%',
                                                //     cursor: 'pointer'
                                                // }} />
                                                <PictureAsPdfIcon sx={{ width: '60%', height: '60%', color: "#bdbdbd" }} />
                                                :
                                                <img
                                                    src={image.preview}
                                                    style={{
                                                        display: 'block',
                                                        borderRadius: 5,
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                    onLoad={() => { URL.revokeObjectURL(image.preview) }}
                                                    alt={`img${index}`}
                                                />
                                        }
                                        <svg onClick={() => removeImages(index)}
                                            style={{
                                                position: "absolute",
                                                top: 5, right: 5, width: 15, height: 15,
                                                color: "red", cursor: "pointer"
                                            }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                        </svg>
                                    </Grid>
                                )}
                                {excelFileUrls.map((item, index) =>
                                    <Grid className='transform hover:-translate-x hover:scale-110'
                                        key={index}
                                        item
                                        xs={5}
                                        sm={3}
                                        md={2}
                                        sx={{
                                            position: 'relative',
                                            display: 'flex', justifyContent: "center",
                                            alignItems: "center",
                                            mt: 1, display: "flex", mx: 1,
                                            borderColor: 'red',
                                            height: 125,
                                            width: 125,
                                        }}
                                        component={Paper}
                                        elevation={2}
                                    >
                                        <InsertDriveFileIcon sx={{ width: '60%', height: '60%', color: "#bdbdbd" }} />
                                        <svg onClick={() => removeExcelFile(index)}
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
                            {/* <OutTable data={item.rows} columns={item.cols} /> */}
                            {/* {excelDimenssion.length > 0 && excelDimenssion.map((item, idx) =>
                                <Box key={idx} className='flex flex-col w-full border my-3 relative'>
                                    <DataSheetGrid
                                        value={item.rows}
                                        columns={item.cols}
                                    />
                                    <svg onClick={() => removeExcelFile(idx)}
                                        style={{
                                            position: "absolute",
                                            bottom: 25, right: 5, width: 15, height: 15,
                                            color: "red", cursor: "pointer"
                                        }} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                    </svg>
                                </Box>
                            )} */}
                            <Typography sx={{ mt: 2, fontSize: 10, color: "#F27A30" }}>* XLSX, PDF, JGP, PNG</Typography>
                        </Box>
                        {isexcelIploading &&
                            <Box sx={{
                                display: "flex", height: "100%", justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <CircularProgress size={50} />
                            </Box>
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
                    {error !== undefined ? error.data?.message
                        : 'You must enter first summary description'}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                open={isSnackBar2Open}
                onClose={closeSnackBar2}
            >
                <Alert onClose={closeSnackBar2} severity="error" sx={{ width: '100%' }}>
                    Only images and pdfs are allowed
                </Alert>
            </Snackbar>
            <PreviewModal open={previewopen} handleClose={handlePreviewClose}
                wrapperComponent={PreviewChild} imgSrc={summaryPreview} />
        </LogiCLoseLayout>
    );
}
export default IsAuthHOC(Performa, "/financialSummary/proforma");

