import React, { useCallback, useEffect, useState, Fragment } from 'react';
import {
    Box, Typography, Modal, Button, Paper, Fade, Grid,
    Divider, Snackbar, Alert, CircularProgress, Backdrop
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import summaryPreview from "../../../public/WebView/DebtAssumptionPreview.png"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Image from "next/image"
import dynamic from "next/dynamic"
import Loader from '../../components/Loader';
import { financialSummarySteps } from "../../utils/steps"
import { useRouter } from 'next/router';
import { useAddDebtAssumptionsMutation, useGetDebtAssumptionsQuery } from '../../services/query';
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
// Loan period
const PreviewChild = () => <Box className='flex flex-col bg-[#469BD3] mx-4 my-4 relative'
    sx={{ height: 300 }}>
    <Box className='flex flex-col px-6 absolute' sx={{ my: 5, width: "85%", top: 20, left: 20 }}>
        <Typography variant='h5' sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Poppins" }}>
            Loan Terms
        </Typography>
        <Box className='flex flex-col' sx={{ mt: 5 }}>
            <Box className='flex flex-row justify-between'>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 1
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 2
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 3
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 4
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
            </Box>

            <Box className='flex flex-row justify-between mt-5'>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 5
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 6
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 7
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                        Label 8
                    </Typography>
                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                        Value (Input Field)
                    </Typography>
                </Box>
            </Box>
        </Box>
    </Box>
    <Box className='flex flex-row justify-between'>
        <svg width="236" height="300" viewBox="0 0 236 289" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M221.727 259.646C211.507 243.258 196.173 231.912 178.282 224.349C174.448 155.016 145.056 89.4644 93.9397 41.5613C41.5472 -8.86284 -28.7361 -37.8567 -102.854 -37.8567C-120.744 -37.8567 -139.912 -36.5961 -157.802 -32.8143C-165.47 -42.8991 -175.693 -51.7233 -185.916 -58.0263C-199.972 -65.5901 -215.307 -70.6323 -231.92 -70.6323C-257.477 -70.6323 -280.479 -60.5474 -298.37 -44.1597C-314.982 -26.5112 -325.205 -3.82041 -325.205 20.131C-325.205 32.737 -322.649 45.3432 -317.538 56.6885C-357.152 102.07 -380.154 157.537 -385.265 216.785C-390.377 276.034 -375.042 335.282 -343.095 385.706C-353.318 400.833 -358.43 418.481 -358.43 436.13C-358.43 455.039 -352.04 472.689 -341.817 487.817C-330.316 502.94 -314.982 514.288 -297.091 520.592C-286.869 524.371 -276.645 525.631 -265.145 525.631C-257.477 525.631 -248.532 524.371 -240.865 523.111C-225.53 519.332 -211.474 510.503 -199.972 500.42C-141.19 520.592 -77.2956 521.851 -18.5132 504.204C40.2696 485.292 91.3849 448.736 127.165 398.312C132.275 399.572 137.389 399.572 142.499 399.572C142.499 399.572 142.499 399.572 143.78 399.572C165.5 399.572 187.225 392.009 203.84 378.142C220.451 364.275 231.951 344.106 234.508 322.676C238.342 299.985 233.227 277.294 221.727 259.646ZM-176.97 455.039C-175.693 448.736 -174.415 441.173 -174.415 434.869C-174.415 410.918 -184.638 388.227 -201.25 370.578C-219.141 352.93 -242.143 344.106 -266.422 344.106C-280.479 344.106 -293.258 346.627 -304.759 352.93C-327.761 313.852 -337.984 267.209 -335.428 221.827C-331.595 176.446 -313.704 132.325 -285.59 97.0278C-274.09 104.592 -261.311 109.634 -247.254 110.895C-229.364 113.416 -211.473 110.895 -196.139 103.331C-179.526 95.7674 -166.748 84.4217 -156.525 70.5553C-147.579 54.1674 -142.468 37.7794 -142.468 20.131C-142.468 17.6098 -142.468 16.3492 -142.468 13.828C-129.689 11.3068 -118.188 11.3068 -104.131 11.3068C-44.0707 11.3068 13.434 33.9976 55.6041 74.3368C96.497 112.155 120.774 163.84 125.889 218.046C110.555 220.567 96.497 226.87 84.9955 236.955C82.4397 239.476 79.8838 240.737 77.328 243.258L76.0503 244.518C65.827 254.603 58.1599 268.47 54.3259 282.337C49.2147 301.246 49.2148 320.155 55.6041 337.803C60.7158 351.669 69.6609 364.275 79.8838 374.36C50.4924 412.178 10.8781 441.173 -35.1255 455.039C-81.1296 470.165 -130.967 470.165 -176.97 455.039ZM-191.027 28.9553C-192.305 36.5191 -196.139 44.0824 -202.528 50.3855C-208.918 56.6885 -215.307 60.4704 -224.252 61.7307C-231.92 62.9915 -240.865 62.9915 -248.532 59.2096C-256.199 55.4277 -262.589 50.3855 -267.7 42.8221C-271.534 36.5191 -274.09 28.9553 -274.09 20.131C-274.09 15.0886 -272.812 8.78559 -271.534 5.00378C-268.978 -0.0385971 -266.422 -5.08101 -262.589 -8.86283C-258.755 -12.6446 -253.644 -15.1658 -248.532 -17.6871C-243.42 -20.2083 -238.309 -20.2083 -233.197 -20.2083C-224.252 -20.2083 -216.585 -17.6871 -208.918 -12.6446C-202.528 -7.60223 -196.139 -1.2992 -193.583 6.26438C-191.027 12.5674 -189.75 20.131 -191.027 28.9553ZM-303.481 419.742C-300.925 414.7 -298.37 409.657 -294.536 405.875C-290.702 402.094 -285.59 399.572 -280.479 397.051C-275.368 394.53 -270.256 394.53 -265.145 394.53H-263.866C-257.477 394.53 -252.365 395.791 -247.254 397.051C-242.143 399.572 -237.031 402.094 -233.197 405.875C-229.364 409.657 -226.808 414.7 -224.252 419.742C-221.696 424.785 -221.696 429.827 -221.696 436.13C-221.696 447.475 -226.808 457.56 -234.475 465.125C-242.143 472.689 -252.365 477.728 -263.866 477.728C-268.978 477.728 -275.368 476.469 -280.479 475.209C-285.59 472.689 -290.702 470.165 -294.536 466.385C-298.37 462.601 -302.203 457.56 -303.481 452.518C-306.037 447.476 -307.315 442.433 -307.315 436.13C-307.315 429.827 -306.037 424.785 -303.481 419.742ZM104.164 291.161C106.721 286.118 109.274 281.076 113.107 277.294C116.941 273.512 122.055 270.991 127.165 268.47C132.275 265.949 137.389 265.949 142.499 265.949C142.499 265.949 142.499 265.949 143.78 265.949H148.89C157.833 267.209 166.781 270.991 173.167 277.294C180.834 284.858 185.949 294.943 185.949 306.288C185.949 317.633 182.115 327.718 173.167 335.282C165.5 342.845 154 347.888 143.78 347.888C132.275 346.627 122.055 342.845 114.388 335.282C106.721 327.718 101.607 317.633 101.607 307.549C100.331 302.506 101.607 296.203 104.164 291.161Z" fill="#FAFBFE" fill-opacity="0.12" />
        </svg>
        <svg width="129" height="300" viewBox="0 0 129 575" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1112.87 441.557C1094.17 411.163 1066.1 390.121 1033.35 376.093C1026.33 247.503 972.527 125.927 878.957 37.0823C783.052 -56.4379 654.398 -110.212 518.726 -110.212C485.977 -110.212 450.89 -107.874 418.141 -100.86C404.106 -119.564 385.393 -135.93 366.68 -147.62C340.949 -161.648 312.879 -171 282.469 -171C235.686 -171 193.58 -152.296 160.832 -121.902C130.423 -89.1699 111.709 -47.0859 111.709 -2.6638C111.709 20.7162 116.388 44.0965 125.745 65.1382C53.2302 149.307 11.125 252.179 1.76833 362.065C-7.58836 471.951 20.4817 581.837 78.9611 675.358C60.2477 703.414 50.891 736.145 50.891 768.877C50.891 803.947 62.5869 836.682 81.3003 864.739C102.353 892.787 130.423 913.834 163.172 925.526C181.885 932.536 200.599 934.873 221.65 934.873C235.686 934.873 252.06 932.536 266.095 930.199C294.166 923.189 319.896 906.816 340.949 888.114C448.551 925.526 565.51 927.863 673.111 895.133C780.714 860.057 874.281 792.257 939.777 698.737C949.13 701.075 958.492 701.075 967.846 701.075C967.846 701.075 967.846 701.075 970.191 701.075C1009.95 701.075 1049.72 687.047 1080.13 661.329C1110.54 635.611 1131.59 598.203 1136.27 558.457C1143.29 516.373 1133.92 474.289 1112.87 441.557ZM383.054 803.947C385.393 792.257 387.732 778.23 387.732 766.54C387.732 722.117 369.019 680.034 338.61 647.301C305.861 614.569 263.756 598.203 219.312 598.203C193.58 598.203 170.189 602.879 149.136 614.569C107.032 542.091 88.3176 455.585 92.9961 371.417C100.013 287.249 132.762 205.419 184.224 139.954C205.276 153.983 228.669 163.334 254.399 165.673C287.147 170.349 319.896 165.673 347.966 151.644C378.376 137.617 401.767 116.574 420.48 90.8567C436.854 60.4624 446.211 30.0681 446.211 -2.6638C446.211 -7.33981 446.211 -9.67783 446.211 -14.3538C469.603 -19.0299 490.656 -19.0299 516.387 -19.0299C626.328 -19.0299 731.591 23.0542 808.784 97.87C883.639 168.01 928.078 263.869 937.441 364.403C909.372 369.078 883.639 380.768 862.585 399.473C857.906 404.148 853.228 406.487 848.549 411.163L846.211 413.501C827.497 432.205 813.462 457.923 806.444 483.641C797.088 518.711 797.088 553.782 808.784 586.513C818.141 612.231 834.515 635.611 853.228 654.315C799.427 724.455 726.912 778.23 642.702 803.947C558.492 832.001 467.264 832.001 383.054 803.947ZM357.323 13.7023C354.984 27.7307 347.966 41.7582 336.27 53.4482C324.574 65.1383 312.879 72.1525 296.504 74.4899C282.469 76.8283 266.095 76.8283 252.06 69.8141C238.025 62.7999 226.329 53.4482 216.973 39.4207C209.955 27.7307 205.276 13.7023 205.276 -2.6638C205.276 -12.0158 207.616 -23.7059 209.955 -30.7199C214.633 -40.0718 219.312 -49.4239 226.329 -56.4379C233.347 -63.4519 242.703 -68.1279 252.06 -72.8039C261.417 -77.48 270.773 -77.48 280.13 -77.48C296.504 -77.48 310.54 -72.8039 324.574 -63.4519C336.27 -54.0999 347.966 -42.4099 352.644 -28.3819C357.323 -16.6918 359.662 -2.6638 357.323 13.7023ZM151.476 738.484C156.154 729.131 160.832 719.78 167.85 712.765C174.867 705.751 184.224 701.075 193.58 696.399C202.937 691.724 212.294 691.724 221.65 691.724H223.99C235.686 691.724 245.043 694.061 254.399 696.399C263.756 701.075 273.113 705.751 280.13 712.765C287.147 719.78 291.826 729.131 296.504 738.484C301.183 747.835 301.183 757.187 301.183 768.877C301.183 789.92 291.826 808.623 277.791 822.654C263.756 836.683 245.043 846.029 223.99 846.029C214.633 846.029 202.937 843.692 193.58 841.356C184.224 836.683 174.867 832 167.85 824.991C160.832 817.972 153.815 808.623 151.476 799.271C146.797 789.92 144.458 780.567 144.458 768.877C144.458 757.187 146.797 747.835 151.476 738.484ZM897.673 500.007C902.354 490.655 907.027 481.303 914.044 474.289C921.061 467.274 930.423 462.599 939.777 457.923C949.13 453.247 958.492 453.247 967.846 453.247C967.846 453.247 967.846 453.247 970.191 453.247H979.544C995.915 455.585 1012.29 462.599 1023.98 474.289C1038.02 488.317 1047.38 507.021 1047.38 528.063C1047.38 549.105 1040.36 567.809 1023.98 581.837C1009.95 595.865 988.898 605.217 970.191 605.217C949.13 602.879 930.423 595.865 916.389 581.837C902.354 567.809 892.992 549.105 892.992 530.401C890.656 521.049 892.992 509.359 897.673 500.007Z" fill="#FAFBFE" fill-opacity="0.12" />
        </svg>
    </Box>
</Box>

const DebtAssumptions = ({ dimension }) => {

    const router = useRouter()
    const token = getData('token')
    const [stepCount, setStepCount] = useState(2)
    const [id, setId] = useState(null)
    const [saveContent, setSaveContent] = useState(false)
    const [isTitleEdit, setIsTitleEdit] = useState(false)
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    const [subTitleId, setSubtitleId] = useState(0)
    const [title, setTitle] = useState('Loan Terms')
    const [debtAssumptionState, setdebtAssumptionState] = useState([
        { isShown: true, name: "loanAmount", label: "Loan Amount", placeholder: '$', value: '' },
        { isShown: true, name: "interest", label: "Interest", placeholder: '% value', value: '' },
        { isShown: true, name: "amortPeriod", label: "Amort Period ", placeholder: 'number', value: '' },
        { isShown: true, name: "annualDebtService", label: 'Annual Debt Service', placeholder: '$', value: '' },
        { isShown: true, name: "loanPeriod", label: 'Loan period', placeholder: 'number', value: '' },
        { isShown: true, name: "ltv", label: 'LTV', placeholder: '% value', value: '' },
        { isShown: false, name: "constant", label: "Constant", placeholder: '% value', value: '' },
        { isShown: false, name: "dscr", label: 'DSCR', placeholder: 'number', value: '' },
        { isShown: false, name: "refinanceYear", label: 'Refinance Year ', placeholder: 'number', value: '' },
        { isShown: false, name: "others", label: 'Others', placeholder: 'Others', value: '' },
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
            setTitle('Loan Terms')
        }
        setIsTitleEdit(!isTitleEdit)
    }

    const currencyFormat = (amount) =>
        parseFloat(amount).toLocaleString('en-US');

    const handleChange = (idx, text) => {
        let newFieldsData = [...debtAssumptionState]
        let newText = text
        if (newFieldsData[idx].name === 'loanAmount' ||
            newFieldsData[idx].name === 'annualDebtService') {
            newText = text.split(',').join('')
        }
        if (isNaN(newText)) {
            setfieldError("Please enter digit")
            setIsSnackBarOpen(true)
            return
        }
        if (newText && (newFieldsData[idx].name === 'loanAmount' || newFieldsData[idx].name === 'annualDebtService')) {
            newFieldsData[idx].value = currencyFormat(newText)
        } else if (newText) {
            newFieldsData[idx].value = parseFloat(newText)
        } else {
            newFieldsData[idx].value = ''
        }
        setdebtAssumptionState(newFieldsData)
    }

    const toggleLabel = (idx) => {
        if (debtAssumptionState[idx]['label'].trim() === '') {
            const newFIelds = [...debtAssumptionState]
            newFIelds[idx]['label'] = 'Label'
            setdebtAssumptionState(newFIelds)
        }
        setSubtitleId(idx)
        setTimeout(() => {
            if (idx === subTitleId) {
                setIsSubTitleEdit(!isSubTitleEdit)
            }
        }, 20)
    }
    const handleLabelChange = (idx, text) => {
        let newFieldsData = [...debtAssumptionState]
        newFieldsData[idx].label = text
        setdebtAssumptionState(newFieldsData)
    }

    const removeTestField = (idx) => {
        let newFieldsData = [...debtAssumptionState]
        // newFieldsData.splice(idx, 1)
        newFieldsData[idx].isShown = false
        newFieldsData[idx].value = 0
        setdebtAssumptionState(newFieldsData)
    }

    const addTestField = (idx) => {
        let newFieldsData = [...debtAssumptionState]
        // newFieldsData.splice(idx, 1)
        newFieldsData[idx].isShown = true
        newFieldsData[idx].value = 0
        setdebtAssumptionState(newFieldsData)
        handleClose()
    }

    const [submitDebtAssumption, { isLoading, data, error }] = useAddDebtAssumptionsMutation()
    const { data: debtAssumptionData, isLoading: getting, error: getError } = useGetDebtAssumptionsQuery(token)

    const handleSubmit = useCallback(() => {
        const isFieldEmpty = debtAssumptionState.slice(0, 2).some(item => !item.value)
        const reqData = debtAssumptionState.reduce((prev, curr) => {
            const newItem = {
                ...prev,
                [curr.name]: {
                    subtitle: curr.label,
                    text: (curr.name === 'loanAmount' || curr.name === 'annualDebtService') && curr.value ?
                        parseFloat(curr.value.split(',').join('')) : !curr.value ? 0 : curr.value,
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
        let debtAssumptionFormData = {}
        if (id) {
            debtAssumptionFormData = { reqData, title, isStepCompleted: true, id }
        } else {
            debtAssumptionFormData = { reqData, title, isStepCompleted: true }
        }
        submitDebtAssumption({ debtAssumptionFormData, token })
    }, [useAddDebtAssumptionsMutation, title, debtAssumptionState])

    useEffect(() => {
        setNumberOfActiveFields(debtAssumptionState.filter(item =>
            item.isShown).length)
    }, [debtAssumptionState])

    useEffect(() => {
        if (debtAssumptionData !== undefined) {
            const { createdAt, updatedAt, __v, _id, userId, isStepCompleted, title, ...rest } = debtAssumptionData
            const newRefinanceArr = Object.keys(rest).map((item, idx) => {
                return {
                    name: item,
                    label: rest[item].subtitle,
                    placeholder: item === 'loanAmount' || item === 'annualDebtService' ? '$' :
                        idx === 1 || idx === 3 ? '0.00%' :
                            idx === 6 ? 'xx%' : 'number',
                    value: item === 'loanAmount' || item === 'annualDebtService' ? currencyFormat(rest[item].text)
                        : rest[item].text,
                    isShown: rest[item].isCompleted
                }
            })
            financialSummarySteps[2].completed = isStepCompleted
            setdebtAssumptionState(newRefinanceArr)
            setTitle(debtAssumptionData.title)
            setId(debtAssumptionData._id)
            let cacheSteps = JSON.parse(getData('stepCompleted'))
            cacheSteps.map(item => {
                if (item.label === financialSummarySteps[2].label) {
                    item.completed = debtAssumptionData.isStepCompleted
                }
            })
            storeData('stepCompleted', JSON.stringify(cacheSteps))
        }
    }, [debtAssumptionData])

    useEffect(() => {
        if (data !== undefined) {
            if (!saveContent) {
                setStepCount(prevStep => prevStep + 1)
                router.push("/financialSummary/proforma")
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
            layoutHeight={numberOfActiveFields > 4 ? "100%" : "100vh"}
            title={"Financial Summary"}
            insideSteps={financialSummarySteps}
            stepCount={stepCount}
            goBackRoute={'/financialSummary/closingCapital'}
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
                        {debtAssumptionState.map((field, idx) =>
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
                                                    {field.label}
                                                    {(idx === 0 || idx === 4) && ' ($) '}
                                                    {(idx === 1 || idx === 3) && ' (x.xx%) '}
                                                    {idx === 5 && ' (x.xx) '}
                                                    {idx === 6 && ' (xx%) '}
                                                    {idx < 4 && <Typography sx={{ color: "red" }}>*</Typography>}
                                                </Typography>
                                            }
                                            <svg onClick={() => toggleLabel(idx)}
                                                style={{ cursor: "pointer", marginLeft: 5, marginBottom: 5 }} width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.29199 8.25005H4.23533C4.29565 8.2504 4.35544 8.23884 4.41128 8.21603C4.46712 8.19322 4.51792 8.15962 4.56074 8.11714L7.73241 4.94089L9.03408 3.66672C9.07703 3.62411 9.11113 3.57342 9.1344 3.51757C9.15767 3.46172 9.16965 3.40181 9.16965 3.3413C9.16965 3.2808 9.15767 3.22089 9.1344 3.16504C9.11113 3.10919 9.07703 3.0585 9.03408 3.01589L7.09074 1.04964C7.04813 1.00668 6.99744 0.97258 6.94159 0.949312C6.88574 0.926043 6.82583 0.914062 6.76533 0.914062C6.70482 0.914063 6.64491 0.926043 6.58906 0.949312C6.53321 0.97258 6.48252 1.00668 6.43991 1.04964L5.14741 2.34672L1.96658 5.52297C1.9241 5.5658 1.89049 5.61659 1.86768 5.67243C1.84487 5.72827 1.83331 5.78807 1.83366 5.84839V7.79172C1.83366 7.91328 1.88195 8.02986 1.9679 8.11581C2.05386 8.20177 2.17043 8.25005 2.29199 8.25005ZM6.76533 2.0213L8.06241 3.31839L7.41158 3.96922L6.11449 2.67214L6.76533 2.0213ZM2.75033 6.0363L5.46824 3.31839L6.76533 4.61547L4.04741 7.33339H2.75033V6.0363ZM9.62533 9.16672H1.37533C1.25377 9.16672 1.13719 9.21501 1.05123 9.30096C0.965281 9.38692 0.916992 9.5035 0.916992 9.62505C0.916992 9.74661 0.965281 9.86319 1.05123 9.94915C1.13719 10.0351 1.25377 10.0834 1.37533 10.0834H9.62533C9.74688 10.0834 9.86346 10.0351 9.94942 9.94915C10.0354 9.86319 10.0837 9.74661 10.0837 9.62505C10.0837 9.5035 10.0354 9.38692 9.94942 9.30096C9.86346 9.21501 9.74688 9.16672 9.62533 9.16672Z" fill="#3E4A3D" />
                                            </svg>
                                        </Box>
                                        {idx > 1 &&
                                            <svg
                                                onClick={() => removeTestField(idx)} style={{ cursor: "pointer" }}
                                                width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
                                            </svg>
                                        }
                                    </Box>
                                    <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
                                        placeholder={field.placeholder}
                                        type={idx === 0 || idx === 4 ? 'text' : 'number'}
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
                        {numberOfActiveFields !== 10 ?
                            <Box>
                                {[...debtAssumptionState].slice(2, debtAssumptionState.length).map((item, idx) =>
                                    !item.isShown &&
                                    <Box key={idx} sx={{
                                        cursor: "pointer",
                                        display: "flex", justifyContent: "center",
                                        height: 30, mb: 1, borderWidth: 1, borderColor: "#bdbdbd",
                                    }} onClick={() => addTestField(idx + 2)}>
                                        <Typography id="transition-modal-title" variant="subtitle1"
                                            component="h4" sx={{ fontFamily: "Poppins" }}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                            : <Typography id="transition-modal-title" variant="subtitle1"
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

    // const router = useRouter()
    // const [stepCount, setStepCount] = useState(2)
    // const token = getData('token')
    // const [id, setId] = useState(null)
    // const [title, setTitle] = useState('DEBT ASSUMPTION')
    // const [isTitleEdit, setIsTitleEdit] = useState(false)
    // const [isSubTitleEdit, setIsSubTitleEdit] = useState(false)
    // const [subTitleId, setSubtitleId] = useState(0)
    // const [debtAssumptionState, setdebtAssumptionState] = useState([{
    //     subTitle: `Label 1`,
    //     description: ''
    // }])

    // const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
    // const closeSnackBar = () => setIsSnackBarOpen(false)

    // const toggleTitle = () => {
    //     if (title.trim() === '') {
    //         setTitle('DEBT ASSUMPTION')
    //     }
    //     setIsTitleEdit(!isTitleEdit)
    // }

    // const toggleSubTitle = (idx) => {
    //     if (debtAssumptionState[idx]['subTitle'].trim() === '') {
    //         const newFIelds = [...debtAssumptionState]
    //         newFIelds[idx]['subTitle'] = 'DEBT ASSUMPTION'
    //         setdebtAssumptionState(newFIelds)
    //     }
    //     setSubtitleId(idx)
    //     setTimeout(() => {
    //         if (idx === subTitleId) {
    //             setIsSubTitleEdit(!isSubTitleEdit)
    //         }
    //     }, 20)
    // }

    // const removeTestField = (idx) => {
    //     let newFieldsData = [...debtAssumptionState]
    //     newFieldsData.splice(idx, 1)
    //     setdebtAssumptionState(newFieldsData)
    // }

    // const handleChange = (idx, text) => {
    //     const newFIelds = [...debtAssumptionState]
    //     newFIelds[idx]['description'] = text
    //     setdebtAssumptionState(newFIelds)
    // }

    // const handleSubtitleChange = (idx, text) => {
    //     const newFIelds = [...debtAssumptionState]
    //     newFIelds[idx]['subTitle'] = text
    //     setdebtAssumptionState(newFIelds)
    // }

    // const [submitDebtAssumption, { isLoading, data, error }] = useAddDebtAssumptionsMutation()
    // const { data: debtAssumptionData, isLoading: getting, error: getError } = useGetDebtAssumptionsQuery(token)

    // const isMobileDevice = useCallback(() => {
    //     if (dimension.innerWidth < 600) { return true }
    // }, [dimension])

    // const handleSubmit = useCallback(() => {
    //     let isEmptyField = false
    //     debtAssumptionState.forEach((item, idx) => {
    //         if (item.subTitle.trim() === '' || item.description.trim() === '') {
    //             isEmptyField = true
    //         }
    //     })
    //     if (isEmptyField) {
    //         setIsSnackBarOpen(true)
    //         return
    //     }
    //     const formData = { reqData: debtAssumptionState, title }
    //     if (id) {
    //         formData['id'] = id
    //     }
    //     submitDebtAssumption({ formData, token })
    // }, [useAddDebtAssumptionsMutation, title, debtAssumptionState])

    // useEffect(() => {
    //     if (debtAssumptionData !== undefined) {
    //         setdebtAssumptionState(debtAssumptionData.featureData.map(item => ({
    //             subTitle: item.subTitle,
    //             description: item.description
    //         })))
    //         setTitle(debtAssumptionData.title)
    //         setId(debtAssumptionData._id)
    //         financialSummarySteps[2].completed = debtAssumptionData.isStepCompleted
    //         let cacheSteps = JSON.parse(getData('stepCompleted'))
    //         cacheSteps.map(item => {
    //             if (item.label === financialSummarySteps[2].label) {
    //                 item.completed = debtAssumptionData.isStepCompleted
    //             }
    //         })
    //         storeData('stepCompleted', JSON.stringify(cacheSteps))
    //     }
    // }, [debtAssumptionData])

    // useEffect(() => {
    //     if (data !== undefined) {
    //         setStepCount(prevStep => prevStep + 1)
    //         router.push("/financialSummary/projectedIncome")
    //     }
    //     if (error !== undefined) {
    //         setIsSnackBarOpen(true)
    //     }
    // }, [data, error])

    // return (
    //     <LogiCLoseLayout
    //         dimension={dimension}
    //         layoutHeight={debtAssumptionState.length > 2 ? "100%" : "100vh"}
    //         title={"Financial Summary"}
    //         insideSteps={financialSummarySteps}
    //         stepCount={stepCount}
    //         goBackRoute={'/financialSummary/closingCapital'}
    //     >
    //         {getting ?
    //             <Box sx={{
    //                 display: "flex", height: "100%", justifyContent: "center",
    //                 alignItems: "center"
    //             }}>
    //                 <CircularProgress size={50} />
    //             </Box>
    //             :
    //             <Paper sx={{
    //                 display: "flex", width: "100%", boxShadow: "0 0 20px 5px #e2e8f0",
    //                 p: 2, flexDirection: "column"
    //             }}>
    //                 <Box sx={{
    //                     display: "flex", justifyContent: "space-between", flexDirection: "column",
    //                     height: "100%"
    //                 }}>
    //                     <Box sx={{ display: "flex", flexDirection: "column" }}>
    //                         <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    //                             <Box sx={{ display: "flex", alignItems: "center" }}>
    //                                 {!isTitleEdit ?
    //                                     <Typography variant='subtitle1'
    //                                         sx={{ fontFamily: "Poppins" }}>
    //                                         {title.slice(0, 30)} {title.length > 30 && '...'}
    //                                     </Typography>
    //                                     :
    //                                     <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
    //                                         placeholder="Enter title"
    //                                         type="text"
    //                                         size='small'
    //                                         value={title}
    //                                         onChange={(e) =>
    //                                             setTitle(e.target.value)}
    //                                         style={{ width: 180, fontFamily: "Poppins" }}
    //                                     />
    //                                 }
    //                                 <HtmlTooltip
    //                                     TransitionComponent={Fade}
    //                                     TransitionProps={{ timeout: 600 }}
    //                                     title={
    //                                         <Fragment>
    //                                             <Image
    //                                                 src={summaryPreview}
    //                                                 style={{ borderRadius: 5 }}
    //                                                 height={300}
    //                                                 width={300}
    //                                                 alt="no image"
    //                                             />
    //                                         </Fragment>
    //                                     }
    //                                 >
    //                                     <InfoOutlinedIcon sx={{ ml: 1, width: 15, height: 15, cursor: "pointer" }} />
    //                                 </HtmlTooltip>
    //                                 <svg onClick={toggleTitle} style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                     <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
    //                                 </svg>
    //                             </Box>
    //                             <Box onClick={() => setdebtAssumptionState(prev => [...prev,
    //                             { subTitle: `Label ${debtAssumptionState.length + 1}`, description: '' }])}
    //                                 sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
    //                                 <AddOutlinedIcon sx={{ color: "#469BD3", width: 15, height: 15 }} />
    //                                 <Typography variant='subtitle2'
    //                                     sx={{ fontFamily: "Poppins", color: "#469BD3", textAlign: "right" }}>
    //                                     Add New
    //                                 </Typography>
    //                             </Box>
    //                         </Box>
    //                         <Divider sx={{ mt: 1, mb: 2 }} />
    //                         {debtAssumptionState.map((item, idx) =>
    //                             <Box key={idx} sx={{
    //                                 display: "flex",
    //                                 flexDirection: "column", mt: idx > 0 ? 2 : 0,
    //                                 width: isMobileDevice() ? "100%" : "48%"
    //                             }}>
    //                                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    //                                     <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
    //                                         {isSubTitleEdit && idx === subTitleId ?
    //                                             <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
    //                                                 placeholder="Enter title"
    //                                                 type="text"
    //                                                 size='small'
    //                                                 onBlur={() => toggleSubTitle(idx)}
    //                                                 value={item.subTitle}
    //                                                 onChange={(e) =>
    //                                                     handleSubtitleChange(idx, e.target.value)}
    //                                                 style={{ width: 180, fontSize: 13, fontFamily: "Poppins" }}
    //                                             /> :
    //                                             <Typography variant='subtitle2'
    //                                                 sx={{ fontFamily: "Poppins" }}>
    //                                                 {item.subTitle.slice(0, 30)} {item.subTitle.length > 30 && '...'}
    //                                             </Typography>
    //                                         }
    //                                         <svg onClick={() => toggleSubTitle(idx)}
    //                                             style={{ marginLeft: 10, cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                             <path d="M2.33334 11.0001H5.16C5.24774 11.0006 5.33472 10.9838 5.41594 10.9506C5.49717 10.9175 5.57104 10.8686 5.63334 10.8068L10.2467 6.18679L12.14 4.33346C12.2025 4.27148 12.2521 4.19775 12.2859 4.11651C12.3198 4.03527 12.3372 3.94813 12.3372 3.86012C12.3372 3.77211 12.3198 3.68498 12.2859 3.60374C12.2521 3.5225 12.2025 3.44876 12.14 3.38679L9.31334 0.526789C9.25136 0.464303 9.17763 0.414707 9.09639 0.380861C9.01515 0.347015 8.92801 0.32959 8.84 0.32959C8.752 0.32959 8.66486 0.347015 8.58362 0.380861C8.50238 0.414707 8.42865 0.464303 8.36667 0.526789L6.48667 2.41346L1.86 7.03346C1.79822 7.09575 1.74933 7.16963 1.71616 7.25085C1.68298 7.33208 1.66616 7.41905 1.66667 7.50679V10.3335C1.66667 10.5103 1.73691 10.6798 1.86193 10.8049C1.98696 10.9299 2.15652 11.0001 2.33334 11.0001ZM8.84 1.94012L10.7267 3.82679L9.78 4.77346L7.89334 2.88679L8.84 1.94012ZM3 7.78012L6.95334 3.82679L8.84 5.71346L4.88667 9.66679H3V7.78012ZM13 12.3335H1C0.823192 12.3335 0.653622 12.4037 0.528598 12.5287C0.403574 12.6537 0.333336 12.8233 0.333336 13.0001C0.333336 13.1769 0.403574 13.3465 0.528598 13.4715C0.653622 13.5966 0.823192 13.6668 1 13.6668H13C13.1768 13.6668 13.3464 13.5966 13.4714 13.4715C13.5964 13.3465 13.6667 13.1769 13.6667 13.0001C13.6667 12.8233 13.5964 12.6537 13.4714 12.5287C13.3464 12.4037 13.1768 12.3335 13 12.3335Z" fill="#3E4A3D" />
    //                                         </svg>
    //                                     </Box>
    //                                     <Box sx={{ display: "flex" }}>
    //                                         {/* <svg style={{ marginRight: 15, cursor: 'pointer' }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                             <path d="M9.24775 12.7501V12.7501C9.24775 12.8284 9.17924 12.9 9.08692 12.9H2.30439C2.21207 12.9 2.14356 12.8284 2.14356 12.7501V4.75014L2.14356 4.75004C2.14349 4.67182 2.21204 4.60005 2.30439 4.60005H3.50879V10.2499C3.50879 10.9987 4.14248 11.6 4.91319 11.6H9.24812L9.24775 12.7501ZM4.75218 2.25018L4.75218 2.25008C4.7521 2.17186 4.82066 2.10009 4.913 2.10009H11.6955C11.7879 2.10009 11.8564 2.17173 11.8564 2.25005L11.8565 10.2501C11.8565 10.3285 11.788 10.4001 11.6957 10.4001H9.87228H9.86952H9.86691H4.913C4.82068 10.4001 4.75218 10.3285 4.75218 10.2501L4.75218 2.25018ZM11.6956 0.9H4.91306C4.14235 0.9 3.50866 1.5013 3.50866 2.25005V3.39996H2.3044C1.53369 3.39996 0.9 4.00125 0.9 4.75V12.75C0.9 13.4987 1.53369 14.1 2.3044 14.1H9.08694C9.85765 14.1 10.4913 13.4987 10.4913 12.75V11.6H11.6956C12.4663 11.6 13.1 10.9987 13.1 10.25V2.25005C13.1 1.50183 12.4663 0.9 11.6956 0.9Z" fill="#469BD3" stroke="#469BD3" strokeWidth="0.2" />
    //                                         </svg> */}
    //                                         {idx !== 0 &&
    //                                             <svg style={{ cursor: 'pointer' }} onClick={() => removeTestField(idx)} width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                                                 <path d="M11.3333 2.99992H8.66667V2.33325C8.66667 1.80282 8.45595 1.29411 8.08088 0.919038C7.70581 0.543966 7.1971 0.333252 6.66667 0.333252H5.33333C4.8029 0.333252 4.29419 0.543966 3.91912 0.919038C3.54405 1.29411 3.33333 1.80282 3.33333 2.33325V2.99992H0.666667C0.489856 2.99992 0.320286 3.07016 0.195262 3.19518C0.0702379 3.32021 0 3.48977 0 3.66659C0 3.8434 0.0702379 4.01297 0.195262 4.13799C0.320286 4.26301 0.489856 4.33325 0.666667 4.33325H1.33333V11.6666C1.33333 12.197 1.54405 12.7057 1.91912 13.0808C2.29419 13.4559 2.8029 13.6666 3.33333 13.6666H8.66667C9.1971 13.6666 9.70581 13.4559 10.0809 13.0808C10.456 12.7057 10.6667 12.197 10.6667 11.6666V4.33325H11.3333C11.5101 4.33325 11.6797 4.26301 11.8047 4.13799C11.9298 4.01297 12 3.8434 12 3.66659C12 3.48977 11.9298 3.32021 11.8047 3.19518C11.6797 3.07016 11.5101 2.99992 11.3333 2.99992ZM4.66667 2.33325C4.66667 2.15644 4.7369 1.98687 4.86193 1.86185C4.98695 1.73682 5.15652 1.66659 5.33333 1.66659H6.66667C6.84348 1.66659 7.01305 1.73682 7.13807 1.86185C7.2631 1.98687 7.33333 2.15644 7.33333 2.33325V2.99992H4.66667V2.33325ZM9.33333 11.6666C9.33333 11.8434 9.2631 12.013 9.13807 12.138C9.01305 12.263 8.84348 12.3333 8.66667 12.3333H3.33333C3.15652 12.3333 2.98695 12.263 2.86193 12.138C2.7369 12.013 2.66667 11.8434 2.66667 11.6666V4.33325H9.33333V11.6666Z" fill="#FF6161" />
    //                                             </svg>
    //                                         }
    //                                     </Box>
    //                                 </Box>
    //                                 <input className='w-full mt-1 border-2 border-stone-300 bg-[#fff] h-10 rounded-md px-2 font-normal'
    //                                     placeholder='Value (Input Field)'
    //                                     size='small'
    //                                     type="text"
    //                                     value={item.description}
    //                                     onChange={(e) =>
    //                                         handleChange(idx, e.target.value)}
    //                                     style={{ fontSize: 13, marginTop: 2, fontFamily: 'Poppins' }}
    //                                 />
    //                             </Box>
    //                         )}
    //                     </Box>
    //                     {isLoading ?
    //                         <Box sx={{
    //                             marginLeft: "auto",
    //                             letterSpacing: 1, mt: 2, width: 90,
    //                             fontFamily: "Poppins", fontWeight: "600"
    //                         }}>
    //                             {/* <CircularProgress size={30} /> */}
    //                             <CircularProgressWithLabel />
    //                         </Box>
    //                         :
    //                         <Button
    //                             className='bg-[#469BD3]'
    //                             type="submit"
    //                             variant="contained"
    //                             sx={{
    //                                 marginLeft: "auto",
    //                                 letterSpacing: 1, mt: 7, width: 90,
    //                                 fontFamily: "Poppins", fontWeight: "600"
    //                             }}
    //                             onClick={handleSubmit}
    //                         >
    //                             Next
    //                         </Button>
    //                     }
    //                 </Box>
    //             </Paper>
    //         }
    //         <Snackbar
    //             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    //             autoHideDuration={3000}
    //             open={isSnackBarOpen}
    //             onClose={closeSnackBar}
    //             key={'bottomcenter'}
    //         >
    //             <Alert onClose={closeSnackBar} severity="error" sx={{ width: '100%' }}>
    //                 {error !== undefined ? error.data?.message : "Field can't be empty"}
    //             </Alert>
    //         </Snackbar>
    //     </LogiCLoseLayout>
    // );
}

export default IsAuthHOC(DebtAssumptions, "/financialSummary/debtAssumptions");