import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Box, Button, Grid, ImageList, ImageListItem, Paper, Typography } from '@mui/material'
import Head from 'next/head'
import Loader from '../../components/Loader';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import squares from "../../../public/WebView/Debt3.png"
import proforma from "../../../public/WebView/setrificate.png"
import proforma2 from "../../../public/WebView/proforma2.png"
import proforma3 from "../../../public/WebView/proforma3.png"
import { getData } from '../../utils/localStorage';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useGetClosingCapitalQuery, useGetDebtAssumptionsQuery, useGetPerformaQuery, useGetSourceFundQuery } from '../../services/query';
import ModalSwiper from '../../components/ModalSwiper';
import { useReactToPrint } from 'react-to-print'
import { Page, Document } from '@react-pdf/renderer'
import { read, utils } from 'xlsx';
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'
import IsAuthHOC from '../../components/IsAuthHOC'
import { useRouter } from 'next/router';
import { BASE_URL } from '../../utils/api';

const LogiCLoseWebLayout = dynamic(
    () => import("../../components/Logiclose/LogiCLoseWebLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const FinancialSummaryComp = ({
    sourceFund, sourceFundData, closingCapital, closingCapitalData,
    currencyFormat, debtAssumption, debtAssumptionData, performa,
    proformaImages, proformaPdfs, proformaExcels, downloadDocs,
    handleOpen, isDoc
}) => {
    return (
        <div>
            <Box className='flex flex-col px-6' sx={{ my: 5 }}>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {sourceFund && sourceFund.title ? sourceFund.title : 'Source / Use of Funds'}
                </Typography>
                {sourceFund &&
                    <Grid container component="main">
                        {sourceFundData.map((item, idx) =>
                            <Grid
                                key={idx}
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                sx={{ mt: 2 }}
                            >
                                <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {`$${currencyFormat(item.text)}`}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                }
            </Box>

            <Box className='flex flex-col px-6' sx={{ my: 5 }}>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {closingCapital && closingCapital.title ? closingCapital.title : 'Closing Capital'}
                </Typography>
                {closingCapital &&
                    <Grid container component="main">
                        {closingCapitalData.map((item, idx) =>
                            <Grid
                                key={idx}
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                sx={{ mt: 2 }}
                            >
                                <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {`$${currencyFormat(item.text)}`}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                }
            </Box>

            <Box className='flex flex-col bg-[#469BD3] ml-5 relative' sx={{ height: 320 }}>
                <Box className='flex flex-col px-6 absolute' sx={{ my: 5, width: "85%", top: 20, left: 20 }}>
                    <Typography variant='h5' sx={{ color: "#FFFFFF", fontWeight: 600, fontFamily: "Poppins" }}>
                        {debtAssumption && debtAssumption.title ? debtAssumption.title : 'Debt Assumptions'}
                    </Typography>
                    {debtAssumption &&
                        <Grid container component="main">
                            {debtAssumptionData.map((item, idx) =>
                                <Grid
                                    key={idx}
                                    item
                                    xs={3}
                                    sm={3}
                                    md={3}
                                    sx={{ mt: 2 }}
                                >
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                        {item.subtitle}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                        {`$${currencyFormat(item.text)}`}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    }
                </Box>
                <Box className='flex flex-row justify-between'>
                    <svg width="236" height="320" viewBox="0 0 236 289" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M221.727 259.646C211.507 243.258 196.173 231.912 178.282 224.349C174.448 155.016 145.056 89.4644 93.9397 41.5613C41.5472 -8.86284 -28.7361 -37.8567 -102.854 -37.8567C-120.744 -37.8567 -139.912 -36.5961 -157.802 -32.8143C-165.47 -42.8991 -175.693 -51.7233 -185.916 -58.0263C-199.972 -65.5901 -215.307 -70.6323 -231.92 -70.6323C-257.477 -70.6323 -280.479 -60.5474 -298.37 -44.1597C-314.982 -26.5112 -325.205 -3.82041 -325.205 20.131C-325.205 32.737 -322.649 45.3432 -317.538 56.6885C-357.152 102.07 -380.154 157.537 -385.265 216.785C-390.377 276.034 -375.042 335.282 -343.095 385.706C-353.318 400.833 -358.43 418.481 -358.43 436.13C-358.43 455.039 -352.04 472.689 -341.817 487.817C-330.316 502.94 -314.982 514.288 -297.091 520.592C-286.869 524.371 -276.645 525.631 -265.145 525.631C-257.477 525.631 -248.532 524.371 -240.865 523.111C-225.53 519.332 -211.474 510.503 -199.972 500.42C-141.19 520.592 -77.2956 521.851 -18.5132 504.204C40.2696 485.292 91.3849 448.736 127.165 398.312C132.275 399.572 137.389 399.572 142.499 399.572C142.499 399.572 142.499 399.572 143.78 399.572C165.5 399.572 187.225 392.009 203.84 378.142C220.451 364.275 231.951 344.106 234.508 322.676C238.342 299.985 233.227 277.294 221.727 259.646ZM-176.97 455.039C-175.693 448.736 -174.415 441.173 -174.415 434.869C-174.415 410.918 -184.638 388.227 -201.25 370.578C-219.141 352.93 -242.143 344.106 -266.422 344.106C-280.479 344.106 -293.258 346.627 -304.759 352.93C-327.761 313.852 -337.984 267.209 -335.428 221.827C-331.595 176.446 -313.704 132.325 -285.59 97.0278C-274.09 104.592 -261.311 109.634 -247.254 110.895C-229.364 113.416 -211.473 110.895 -196.139 103.331C-179.526 95.7674 -166.748 84.4217 -156.525 70.5553C-147.579 54.1674 -142.468 37.7794 -142.468 20.131C-142.468 17.6098 -142.468 16.3492 -142.468 13.828C-129.689 11.3068 -118.188 11.3068 -104.131 11.3068C-44.0707 11.3068 13.434 33.9976 55.6041 74.3368C96.497 112.155 120.774 163.84 125.889 218.046C110.555 220.567 96.497 226.87 84.9955 236.955C82.4397 239.476 79.8838 240.737 77.328 243.258L76.0503 244.518C65.827 254.603 58.1599 268.47 54.3259 282.337C49.2147 301.246 49.2148 320.155 55.6041 337.803C60.7158 351.669 69.6609 364.275 79.8838 374.36C50.4924 412.178 10.8781 441.173 -35.1255 455.039C-81.1296 470.165 -130.967 470.165 -176.97 455.039ZM-191.027 28.9553C-192.305 36.5191 -196.139 44.0824 -202.528 50.3855C-208.918 56.6885 -215.307 60.4704 -224.252 61.7307C-231.92 62.9915 -240.865 62.9915 -248.532 59.2096C-256.199 55.4277 -262.589 50.3855 -267.7 42.8221C-271.534 36.5191 -274.09 28.9553 -274.09 20.131C-274.09 15.0886 -272.812 8.78559 -271.534 5.00378C-268.978 -0.0385971 -266.422 -5.08101 -262.589 -8.86283C-258.755 -12.6446 -253.644 -15.1658 -248.532 -17.6871C-243.42 -20.2083 -238.309 -20.2083 -233.197 -20.2083C-224.252 -20.2083 -216.585 -17.6871 -208.918 -12.6446C-202.528 -7.60223 -196.139 -1.2992 -193.583 6.26438C-191.027 12.5674 -189.75 20.131 -191.027 28.9553ZM-303.481 419.742C-300.925 414.7 -298.37 409.657 -294.536 405.875C-290.702 402.094 -285.59 399.572 -280.479 397.051C-275.368 394.53 -270.256 394.53 -265.145 394.53H-263.866C-257.477 394.53 -252.365 395.791 -247.254 397.051C-242.143 399.572 -237.031 402.094 -233.197 405.875C-229.364 409.657 -226.808 414.7 -224.252 419.742C-221.696 424.785 -221.696 429.827 -221.696 436.13C-221.696 447.475 -226.808 457.56 -234.475 465.125C-242.143 472.689 -252.365 477.728 -263.866 477.728C-268.978 477.728 -275.368 476.469 -280.479 475.209C-285.59 472.689 -290.702 470.165 -294.536 466.385C-298.37 462.601 -302.203 457.56 -303.481 452.518C-306.037 447.476 -307.315 442.433 -307.315 436.13C-307.315 429.827 -306.037 424.785 -303.481 419.742ZM104.164 291.161C106.721 286.118 109.274 281.076 113.107 277.294C116.941 273.512 122.055 270.991 127.165 268.47C132.275 265.949 137.389 265.949 142.499 265.949C142.499 265.949 142.499 265.949 143.78 265.949H148.89C157.833 267.209 166.781 270.991 173.167 277.294C180.834 284.858 185.949 294.943 185.949 306.288C185.949 317.633 182.115 327.718 173.167 335.282C165.5 342.845 154 347.888 143.78 347.888C132.275 346.627 122.055 342.845 114.388 335.282C106.721 327.718 101.607 317.633 101.607 307.549C100.331 302.506 101.607 296.203 104.164 291.161Z" fill="#FAFBFE" fillOpacity="0.12" />
                    </svg>
                    <svg width="129" height="320" viewBox="0 0 129 575" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1112.87 441.557C1094.17 411.163 1066.1 390.121 1033.35 376.093C1026.33 247.503 972.527 125.927 878.957 37.0823C783.052 -56.4379 654.398 -110.212 518.726 -110.212C485.977 -110.212 450.89 -107.874 418.141 -100.86C404.106 -119.564 385.393 -135.93 366.68 -147.62C340.949 -161.648 312.879 -171 282.469 -171C235.686 -171 193.58 -152.296 160.832 -121.902C130.423 -89.1699 111.709 -47.0859 111.709 -2.6638C111.709 20.7162 116.388 44.0965 125.745 65.1382C53.2302 149.307 11.125 252.179 1.76833 362.065C-7.58836 471.951 20.4817 581.837 78.9611 675.358C60.2477 703.414 50.891 736.145 50.891 768.877C50.891 803.947 62.5869 836.682 81.3003 864.739C102.353 892.787 130.423 913.834 163.172 925.526C181.885 932.536 200.599 934.873 221.65 934.873C235.686 934.873 252.06 932.536 266.095 930.199C294.166 923.189 319.896 906.816 340.949 888.114C448.551 925.526 565.51 927.863 673.111 895.133C780.714 860.057 874.281 792.257 939.777 698.737C949.13 701.075 958.492 701.075 967.846 701.075C967.846 701.075 967.846 701.075 970.191 701.075C1009.95 701.075 1049.72 687.047 1080.13 661.329C1110.54 635.611 1131.59 598.203 1136.27 558.457C1143.29 516.373 1133.92 474.289 1112.87 441.557ZM383.054 803.947C385.393 792.257 387.732 778.23 387.732 766.54C387.732 722.117 369.019 680.034 338.61 647.301C305.861 614.569 263.756 598.203 219.312 598.203C193.58 598.203 170.189 602.879 149.136 614.569C107.032 542.091 88.3176 455.585 92.9961 371.417C100.013 287.249 132.762 205.419 184.224 139.954C205.276 153.983 228.669 163.334 254.399 165.673C287.147 170.349 319.896 165.673 347.966 151.644C378.376 137.617 401.767 116.574 420.48 90.8567C436.854 60.4624 446.211 30.0681 446.211 -2.6638C446.211 -7.33981 446.211 -9.67783 446.211 -14.3538C469.603 -19.0299 490.656 -19.0299 516.387 -19.0299C626.328 -19.0299 731.591 23.0542 808.784 97.87C883.639 168.01 928.078 263.869 937.441 364.403C909.372 369.078 883.639 380.768 862.585 399.473C857.906 404.148 853.228 406.487 848.549 411.163L846.211 413.501C827.497 432.205 813.462 457.923 806.444 483.641C797.088 518.711 797.088 553.782 808.784 586.513C818.141 612.231 834.515 635.611 853.228 654.315C799.427 724.455 726.912 778.23 642.702 803.947C558.492 832.001 467.264 832.001 383.054 803.947ZM357.323 13.7023C354.984 27.7307 347.966 41.7582 336.27 53.4482C324.574 65.1383 312.879 72.1525 296.504 74.4899C282.469 76.8283 266.095 76.8283 252.06 69.8141C238.025 62.7999 226.329 53.4482 216.973 39.4207C209.955 27.7307 205.276 13.7023 205.276 -2.6638C205.276 -12.0158 207.616 -23.7059 209.955 -30.7199C214.633 -40.0718 219.312 -49.4239 226.329 -56.4379C233.347 -63.4519 242.703 -68.1279 252.06 -72.8039C261.417 -77.48 270.773 -77.48 280.13 -77.48C296.504 -77.48 310.54 -72.8039 324.574 -63.4519C336.27 -54.0999 347.966 -42.4099 352.644 -28.3819C357.323 -16.6918 359.662 -2.6638 357.323 13.7023ZM151.476 738.484C156.154 729.131 160.832 719.78 167.85 712.765C174.867 705.751 184.224 701.075 193.58 696.399C202.937 691.724 212.294 691.724 221.65 691.724H223.99C235.686 691.724 245.043 694.061 254.399 696.399C263.756 701.075 273.113 705.751 280.13 712.765C287.147 719.78 291.826 729.131 296.504 738.484C301.183 747.835 301.183 757.187 301.183 768.877C301.183 789.92 291.826 808.623 277.791 822.654C263.756 836.683 245.043 846.029 223.99 846.029C214.633 846.029 202.937 843.692 193.58 841.356C184.224 836.683 174.867 832 167.85 824.991C160.832 817.972 153.815 808.623 151.476 799.271C146.797 789.92 144.458 780.567 144.458 768.877C144.458 757.187 146.797 747.835 151.476 738.484ZM897.673 500.007C902.354 490.655 907.027 481.303 914.044 474.289C921.061 467.274 930.423 462.599 939.777 457.923C949.13 453.247 958.492 453.247 967.846 453.247C967.846 453.247 967.846 453.247 970.191 453.247H979.544C995.915 455.585 1012.29 462.599 1023.98 474.289C1038.02 488.317 1047.38 507.021 1047.38 528.063C1047.38 549.105 1040.36 567.809 1023.98 581.837C1009.95 595.865 988.898 605.217 970.191 605.217C949.13 602.879 930.423 595.865 916.389 581.837C902.354 567.809 892.992 549.105 892.992 530.401C890.656 521.049 892.992 509.359 897.673 500.007Z" fill="#FAFBFE" fillOpacity="0.12" />
                    </svg>
                </Box>
            </Box>
            <Box className='flex flex-row justify-end'>
                <Box sx={{ width: '20%' }}>
                    <Image src={squares} layout='responsive' />
                </Box>
            </Box>
            <Box className='flex flex-col ml-6 mb-8'>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {performa ? performa.title : 'Performa'}
                </Typography>
                {/* {performa ?
            <Box className='no-scrollbar mt-6' sx={{ width: '100%', cursor: 'pointer' }}>
                <ImageList variant="masonry" cols={2} gap={10}>
                    {proformaImages.length > 0 && proformaImages.map((item, idx) => (
                        <ImageListItem key={idx}>
                            <img
                                src={item}
                                srcSet={item}
                                style={{ width: '100%' }}
                                alt={idx}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                {proformaPdfs.length > 0 && proformaPdfs.map((item, idx) =>
                    <div className='z-20' key={idx} style={{ width: 500, height: 500 }}>
                        <iframe src={item}
                            width="100%"
                            height="100%"
                        />
                    </div>
                )}
            </Box>
            :
            <Box className='flex flex-row mt-6 pr-2' sx={{ width: "100%" }}>
                <Image src={proforma} height={880} width={660} />
                <Box className='flex flex-col' sx={{ ml: 2 }}>
                    <Image src={proforma2} height={430} width={700} />
                    <Box sx={{ mt: 3 }}>
                        <Image src={proforma3} height={430} width={700} />
                    </Box>
                </Box>
            </Box>
        } */}
                {performa && proformaImages.length > 0 ?
                    <Box className='flex flex-row mt-6 pr-2 cursor-pointer' sx={{ width: "100%" }}
                        onClick={() => handleOpen()}>
                        <img
                            src={proformaImages[0]}
                            srcSet={proformaImages[0]}
                            style={{ width: '50%', height: 860 }}
                            alt={'rtr'}
                            loading="lazy"
                        />
                        {proformaImages.length > 1 &&
                            <Box className='flex flex-col' sx={{ ml: 2, width: '50%' }}>
                                <img
                                    src={proformaImages[1]}
                                    srcSet={proformaImages[1]}
                                    style={{ width: '100%', height: 430 }}
                                    alt={'asdsd'}
                                    loading="lazy"
                                />
                                {proformaImages.length > 2 &&
                                    <Box sx={{ mt: 3, position: 'relative' }}>
                                        <img className={proformaImages.length > 3 ? 'brightness-50' : ''}
                                            src={proformaImages[2]}
                                            srcSet={proformaImages[2]}
                                            style={{ width: '100%', height: 410 }}
                                            alt={'asd'}
                                            loading="lazy"
                                        />
                                        {proformaImages.length > 3 &&
                                            <Box className='flex justify-center items-center absolute top-[45%] left-[45%]'>
                                                <Typography variant='h2'
                                                    sx={{ color: "#fff", fontWeight: 600, fontFamily: "Poppins" }}>
                                                    +{proformaImages.length - 3}
                                                </Typography>
                                            </Box>
                                        }
                                    </Box>
                                }
                            </Box>
                        }
                    </Box>
                    :
                    <Box className='flex flex-row mt-6 pr-2' sx={{ width: "100%" }}>
                        <Image src={proforma} height={880} width={660} />
                        <Box className='flex flex-col' sx={{ ml: 2 }}>
                            <Image src={proforma2} height={430} width={700} />
                            <Box sx={{ mt: 3 }}>
                                <Image src={proforma3} height={430} width={700} />
                            </Box>
                        </Box>
                    </Box>
                }
            </Box>
            {proformaPdfs.length > 0 && isDoc &&
                <Box className='flex flex-col ml-6 my-6'>
                    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins", mb: 2 }}>
                        Documents
                    </Typography>
                    <Grid container component="main">
                        {proformaPdfs.map((item, idx) =>
                            // <div className='z-20 mr-2' key={idx} style={{ width: 500, height: 500 }}>
                            //     <iframe src={item}
                            //         width={500}
                            //         height="100%"
                            //     />
                            // </div>
                            <Grid className='transform hover:-translate-x hover:scale-110'
                                key={idx}
                                item
                                xs={5}
                                sm={3}
                                md={2}
                                sx={{
                                    display: 'flex', justifyContent: "center",
                                    alignItems: "center", mt: 1, mx: 1,
                                    borderColor: '#469BD3', borderWidth: 1,
                                    height: 125, width: 125, cursor: 'pointer'
                                }}
                                component={Paper}
                                elevation={2}
                                onClick={() => downloadDocs(item)}
                            >
                                <PictureAsPdfIcon sx={{ width: '60%', height: '60%', color: "#bdbdbd" }} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            }
            {proformaExcels.length > 0 && isDoc &&
                <Box className='flex flex-col ml-6 my-6'>
                    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins", mb: 2 }}>
                        Excel Documents
                    </Typography>
                    <Grid container component="main">
                        {proformaExcels.map((item, idx) =>
                            <Grid className='transform hover:-translate-x hover:scale-110'
                                key={idx}
                                item
                                xs={5}
                                sm={3}
                                md={2}
                                sx={{
                                    display: 'flex', justifyContent: "center",
                                    alignItems: "center", mt: 1, mx: 1,
                                    borderColor: '#469BD3', borderWidth: 1,
                                    height: 125, width: 125, cursor: 'pointer'
                                }}
                                component={Paper}
                                elevation={2}
                                onClick={() => downloadDocs(item)}
                            >
                                <InsertDriveFileIcon sx={{ width: '60%', height: '60%', color: "#bdbdbd" }} />
                            </Grid>
                            //         {/* <DataSheetGrid
                            //         value={item.rows}
                            //         columns={item.cols}
                            //     /> */}
                        )}
                    </Grid>
                </Box>
            }
        </div>
    )
}

const FinancialSummary = () => {

    //print
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const router = useRouter()
    let token = ''
    if (router.query.token) {
        token = router.query.token.split('____')[0]
    } else {
        token = getData('token')
    }
    const { data: sourceFund, isLoading: gettingSF, error: error1 } = useGetSourceFundQuery(token)
    const { data: closingCapital, isLoading: gettingCC, error: error2 } = useGetClosingCapitalQuery(token)
    const { data: debtAssumption, isLoading: gettingDA, error: error3 } = useGetDebtAssumptionsQuery(token)
    const { data: performaData, isLoading: gettingP, error: error4 } = useGetPerformaQuery(token)

    const randomPass = useMemo(() => Math.floor(1000 + Math.random() * 9000), [token])
    const sharedUrl = useMemo(() =>
        `${BASE_URL}/webView/financialSummary?token=${token}____${randomPass}`
        , [BASE_URL, token])

    const [performa, setPerforma] = useState(null)
    const [proformaImages, setProformaImages] = useState([])
    const [proformaPdfs, setProformaPdf] = useState([])
    const [proformaExcels, setProformaExcels] = useState([])
    // const [excelDimenssion, setExcelDimenssion] = useState([])

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    const currencyFormat = (amount) =>
        parseFloat(amount).toLocaleString('en-US');

    const downloadDocs = (data) => {
        const link = document.createElement('a');
        link.href = data;
        link.download = data
        // document.body.appendChild(link)
        // link.click()
        link.dispatchEvent(new MouseEvent('click'));
        // document.body.removeChild(link)
    }

    useEffect(() => {
        if (performaData !== undefined) {
            const proformaImages = []
            const proformaPdf = []
            const proformaExcels = performaData.performa.images.filter(item =>
                item.split('.')[item.split('.').length - 1] === 'xlsx')

            performaData.performa.images.forEach((item) => {
                const ext = item.split('.')[item.split('.').length - 1]
                if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
                    proformaImages.push(item)
                } else if (ext === 'pdf') {
                    proformaPdf.push(item)
                }
            })
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
            setProformaPdf(proformaPdf)
            setProformaImages(proformaImages)
            setProformaExcels(proformaExcels)
            setPerforma(performaData)
        }
    }, [performaData])

    const sourceFundData = useMemo(() => {
        if (!sourceFund) {
            return []
        }
        const { createdAt, isStepCompleted, title, updatedAt, userId, __v, _id, ...rest } = sourceFund
        return Object.keys(rest).filter(item =>
            sourceFund[item].text !== 0 && sourceFund[item].text !== null)
            .map(item => sourceFund[item])
    }, [sourceFund])

    const closingCapitalData = useMemo(() => {
        if (!closingCapital) {
            return []
        }
        const { createdAt, isStepCompleted, title, updatedAt, userId, __v, _id, ...rest } = closingCapital
        return Object.keys(rest).filter(item =>
            closingCapital[item].text !== 0 && closingCapital[item].text !== null)
            .map(item => closingCapital[item])
    }, [closingCapital])

    const debtAssumptionData = useMemo(() => {
        if (!debtAssumption) {
            return []
        }
        const { createdAt, isStepCompleted, title, updatedAt, userId, __v, _id, ...rest } = debtAssumption
        return Object.keys(rest).filter(item =>
            debtAssumption[item].text !== 0 && debtAssumption[item].text !== null)
            .map(item => debtAssumption[item])
    }, [debtAssumption])

    const PrintComp = () =>
        <Document ref={componentRef}>
            <Page size="A4" style={{
                flexDirection: 'column',
                backgroundColor: '#fff'
            }} orientation="portrait">
                <Box sx={{ width: '100%', mb: 4 }}>
                    <img
                        src={'https://storage.googleapis.com/logiclose/FinancialSUmmaryPDF.png'}
                        style={{
                            display: 'block',
                            objectFit: 'contain'
                        }}
                        alt={`img`}
                    />
                    <Box sx={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        position: "absolute", top: '20%', left: "30%", width: 350
                    }}>
                        <Box sx={{ position: "relative" }}>
                            <svg width="197" height="131" viewBox="0 0 197 131" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.9168 122.584L19.5895 124.3L20.9168 122.584ZM5.45397 100.249L3.40686 100.967L3.41251 100.983L3.41841 100.999L5.45397 100.249ZM6.02667 32.2886L8.04448 33.0851L8.04798 33.0761L6.02667 32.2886ZM21.6804 9.18978L23.0817 10.8458L23.0845 10.8434L21.6804 9.18978ZM84.6773 30.9523L82.6301 31.6701L82.6358 31.6862L82.6417 31.7023L84.6773 30.9523ZM84.2955 98.9125L86.3133 99.709L86.3168 99.7001L84.2955 98.9125ZM68.4508 122.011L69.8365 123.68L69.8457 123.673L69.8548 123.665L68.4508 122.011ZM57.7604 114.757L55.8906 113.657L55.8785 113.678L55.8667 113.699L57.7604 114.757ZM63.4874 97.0035L65.6262 97.3661L63.4874 97.0035ZM62.9147 39.7337L60.7781 40.109L60.779 40.114L62.9147 39.7337ZM55.2787 17.5894L53.4342 18.7312L53.444 18.7469L53.454 18.7624L55.2787 17.5894ZM32.7526 15.8713L30.9224 14.7066L30.9097 14.7266L30.8974 14.7469L32.7526 15.8713ZM26.8347 33.434L24.7021 33.0364L24.6994 33.0509L24.6969 33.0654L26.8347 33.434ZM27.4074 91.2766L25.2708 91.6519L25.2717 91.6569L27.4074 91.2766ZM35.0434 113.23L33.2186 114.403L33.2284 114.418L33.2384 114.433L35.0434 113.23ZM45.1611 128.242C36.1707 128.242 28.5693 125.761 22.2442 120.868L19.5895 124.3C26.7546 129.843 35.316 132.58 45.1611 132.58V128.242ZM22.2442 120.868C15.8826 115.947 10.9418 108.869 7.48953 99.4989L3.41841 100.999C7.09306 110.973 12.4608 118.785 19.5895 124.3L22.2442 120.868ZM7.50108 99.531C4.1652 90.0176 2.469 78.6902 2.469 65.5051H-1.86963C-1.86963 79.046 -0.129643 90.8811 3.40686 100.967L7.50108 99.531ZM2.469 65.5051C2.469 53.2526 4.34438 42.4586 8.04446 33.0851L4.00887 31.4921C0.0729709 41.4631 -1.86963 52.8134 -1.86963 65.5051H2.469ZM8.04798 33.0761C11.7626 23.542 16.7926 16.1673 23.0817 10.8458L20.2792 7.53376C13.3326 13.4117 7.92674 21.4362 4.00535 31.5011L8.04798 33.0761ZM23.0845 10.8434C29.4346 5.45183 36.7629 2.76861 45.1611 2.76861V-1.57001C35.7419 -1.57001 27.4165 1.47376 20.2764 7.53613L23.0845 10.8434ZM45.1611 2.76861C54.1514 2.76861 61.7528 5.24897 68.0779 10.142L70.7326 6.71035C63.5676 1.16756 55.0062 -1.57001 45.1611 -1.57001V2.76861ZM68.0779 10.142C74.426 15.0528 79.3021 22.1791 82.6301 31.6701L86.7244 30.2345C83.18 20.1265 77.8748 12.2354 70.7326 6.71035L68.0779 10.142ZM82.6417 31.7023C86.0948 41.075 87.8531 52.3261 87.8531 65.5051H92.1917C92.1917 51.9582 90.3866 40.1741 86.7128 30.2024L82.6417 31.7023ZM87.8531 65.5051C87.8531 77.7568 85.978 88.6185 82.2741 98.125L86.3168 99.7001C90.2489 89.6076 92.1917 78.1976 92.1917 65.5051H87.8531ZM82.2777 98.116C78.5677 107.515 73.4759 114.899 67.0468 120.358L69.8548 123.665C76.9159 117.67 82.3872 109.655 86.3133 99.709L82.2777 98.116ZM67.0651 120.342C60.7101 125.618 53.4373 128.242 45.1611 128.242V132.58C54.4476 132.58 62.7012 129.604 69.8365 123.68L67.0651 120.342ZM48.5973 123.417C53.3399 123.417 57.0029 120.56 59.6541 115.815L55.8667 113.699C53.6818 117.609 51.236 119.078 48.5973 119.078V123.417ZM59.6302 115.857C62.3598 111.217 64.3299 105.014 65.6262 97.3661L61.3486 96.641C60.0996 104.01 58.2517 109.644 55.8906 113.657L59.6302 115.857ZM65.6262 97.3661C66.9235 89.712 67.5657 81.0605 67.5657 71.423H63.2271C63.2271 80.8755 62.5966 89.2776 61.3486 96.641L65.6262 97.3661ZM67.5657 71.423C67.5657 59.4903 66.732 48.7962 65.0504 39.3534L60.779 40.114C62.4063 49.252 63.2271 59.6842 63.2271 71.423H67.5657ZM65.0513 39.3583C63.3697 29.7864 60.7538 22.0945 57.1035 16.4163L53.454 18.7624C56.676 23.7746 59.1508 30.8456 60.7781 40.109L65.0513 39.3583ZM57.1232 16.4475C53.5005 10.5955 48.5371 7.40226 42.2976 7.40226V11.7409C46.7484 11.7409 50.4391 13.8929 53.4342 18.7312L57.1232 16.4475ZM42.2976 7.40226C37.6169 7.40226 33.8386 10.124 30.9224 14.7066L34.5828 17.0359C37.0118 13.2189 39.5968 11.7409 42.2976 11.7409V7.40226ZM30.8974 14.7469C28.1628 19.2589 26.1263 25.3975 24.7021 33.0364L28.9673 33.8316C30.3429 26.4531 32.2517 20.8831 34.6078 16.9956L30.8974 14.7469ZM24.6969 33.0654C23.398 40.5991 22.7564 49.3178 22.7564 59.2054H27.095C27.095 49.4941 27.7261 41.0318 28.9725 33.8026L24.6969 33.0654ZM22.7564 59.2054C22.7564 71.2645 23.59 82.084 25.2708 91.6519L29.544 90.9012C27.9159 81.6337 27.095 71.0724 27.095 59.2054H22.7564ZM25.2717 91.6569C26.9543 101.105 29.5712 108.729 33.2186 114.403L36.8682 112.057C33.6432 107.04 31.1695 100.029 29.5431 90.8962L25.2717 91.6569ZM33.2384 114.433C37.1233 120.261 42.2648 123.417 48.5973 123.417V119.078C43.9848 119.078 40.0904 116.89 36.8484 112.027L33.2384 114.433ZM132.618 128.502H130.449V130.671H132.618V128.502ZM132.618 125.448L131.824 123.429L130.449 123.97V125.448H132.618ZM150.563 118.384L151.357 120.403L152.732 119.862V118.384H150.563ZM150.563 93.7582H152.732V91.5889H150.563V93.7582ZM98.6383 93.7582H96.469V95.9276H98.6383V93.7582ZM98.6383 88.7949L96.9175 87.4739L96.469 88.0582V88.7949H98.6383ZM164.88 2.50829V0.338982H163.811L163.16 1.1873L164.88 2.50829ZM173.471 2.50829H175.64V0.338982H173.471V2.50829ZM173.471 79.6317H171.302V81.801H173.471V79.6317ZM196.188 79.6317H198.357V77.4624H196.188V79.6317ZM196.188 93.7582V95.9276H198.357V93.7582H196.188ZM173.471 93.7582V91.5889H171.302V93.7582H173.471ZM173.471 118.384H171.302V119.799L172.596 120.37L173.471 118.384ZM189.506 125.448H191.676V124.033L190.381 123.462L189.506 125.448ZM189.506 128.502V130.671H191.676V128.502H189.506ZM116.965 79.6317L115.226 78.3348L112.641 81.801H116.965V79.6317ZM150.563 79.6317V81.801H152.732V79.6317H150.563ZM150.563 34.5794H152.732V28.0419L148.824 33.2825L150.563 34.5794ZM134.788 128.502V125.448H130.449V128.502H134.788ZM133.413 127.466L151.357 120.403L149.768 116.366L131.824 123.429L133.413 127.466ZM152.732 118.384V93.7582H148.394V118.384H152.732ZM150.563 91.5889H98.6383V95.9276H150.563V91.5889ZM100.808 93.7582V88.7949H96.469V93.7582H100.808ZM100.359 90.1159L166.601 3.82929L163.16 1.1873L96.9175 87.4739L100.359 90.1159ZM164.88 4.67761H173.471V0.338982H164.88V4.67761ZM171.302 2.50829V79.6317H175.64V2.50829H171.302ZM173.471 81.801H196.188V77.4624H173.471V81.801ZM194.019 79.6317V93.7582H198.357V79.6317H194.019ZM196.188 91.5889H173.471V95.9276H196.188V91.5889ZM171.302 93.7582V118.384H175.64V93.7582H171.302ZM172.596 120.37L188.632 127.433L190.381 123.462L174.345 116.399L172.596 120.37ZM187.337 125.448V128.502H191.676V125.448H187.337ZM189.506 126.333H132.618V130.671H189.506V126.333ZM116.965 81.801H150.563V77.4624H116.965V81.801ZM152.732 79.6317V34.5794H148.394V79.6317H152.732ZM148.824 33.2825L115.226 78.3348L118.704 80.9286L152.302 35.8763L148.824 33.2825Z" fill="url(#paint0_linear_806_8112)" />
                                <defs>
                                    <linearGradient id="paint0_linear_806_8112" x1="96.5" y1="-5.49805" x2="96.5" y2="128.999" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="white" />
                                        <stop offset="1" stop-color="white" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg style={{ position: "absolute", bottom: -20, left: -100 }} width="400" height="70" viewBox="0 0 652 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M29 5.932V13.39H9.794V25.204H24.512V32.53H9.794V52H0.554V5.932H29ZM44.792 5.932V52H35.552V5.932H44.792ZM74.1832 14.908C78.5392 14.908 82.0592 16.294 84.7432 19.066C87.4272 21.794 88.7692 25.622 88.7692 30.55V52H79.5292V31.804C79.5292 28.9 78.8032 26.678 77.3512 25.138C75.8992 23.554 73.9192 22.762 71.4112 22.762C68.8592 22.762 66.8352 23.554 65.3392 25.138C63.8872 26.678 63.1612 28.9 63.1612 31.804V52H53.9212V15.436H63.1612V19.99C64.3932 18.406 65.9552 17.174 67.8472 16.294C69.7832 15.37 71.8952 14.908 74.1832 14.908ZM95.18 33.586C95.18 29.89 95.906 26.612 97.358 23.752C98.854 20.892 100.856 18.692 103.364 17.152C105.916 15.612 108.754 14.842 111.878 14.842C114.606 14.842 116.982 15.392 119.006 16.492C121.074 17.592 122.724 18.978 123.956 20.65V15.436H133.262V52H123.956V46.654C122.768 48.37 121.118 49.8 119.006 50.944C116.938 52.044 114.54 52.594 111.812 52.594C108.732 52.594 105.916 51.802 103.364 50.218C100.856 48.634 98.854 46.412 97.358 43.552C95.906 40.648 95.18 37.326 95.18 33.586ZM123.956 33.718C123.956 31.474 123.516 29.56 122.636 27.976C121.756 26.348 120.568 25.116 119.072 24.28C117.576 23.4 115.97 22.96 114.254 22.96C112.538 22.96 110.954 23.378 109.502 24.214C108.05 25.05 106.862 26.282 105.938 27.91C105.058 29.494 104.618 31.386 104.618 33.586C104.618 35.786 105.058 37.722 105.938 39.394C106.862 41.022 108.05 42.276 109.502 43.156C110.998 44.036 112.582 44.476 114.254 44.476C115.97 44.476 117.576 44.058 119.072 43.222C120.568 42.342 121.756 41.11 122.636 39.526C123.516 37.898 123.956 35.962 123.956 33.718ZM162.548 14.908C166.904 14.908 170.424 16.294 173.108 19.066C175.792 21.794 177.134 25.622 177.134 30.55V52H167.894V31.804C167.894 28.9 167.168 26.678 165.716 25.138C164.264 23.554 162.284 22.762 159.776 22.762C157.224 22.762 155.2 23.554 153.704 25.138C152.252 26.678 151.526 28.9 151.526 31.804V52H142.286V15.436H151.526V19.99C152.758 18.406 154.32 17.174 156.212 16.294C158.148 15.37 160.26 14.908 162.548 14.908ZM183.545 33.718C183.545 29.934 184.315 26.634 185.855 23.818C187.395 20.958 189.529 18.758 192.257 17.218C194.985 15.634 198.109 14.842 201.629 14.842C206.161 14.842 209.901 15.986 212.849 18.274C215.841 20.518 217.843 23.686 218.855 27.778H208.889C208.361 26.194 207.459 24.962 206.183 24.082C204.951 23.158 203.411 22.696 201.563 22.696C198.923 22.696 196.833 23.664 195.293 25.6C193.753 27.492 192.983 30.198 192.983 33.718C192.983 37.194 193.753 39.9 195.293 41.836C196.833 43.728 198.923 44.674 201.563 44.674C205.303 44.674 207.745 43.002 208.889 39.658H218.855C217.843 43.618 215.841 46.764 212.849 49.096C209.857 51.428 206.117 52.594 201.629 52.594C198.109 52.594 194.985 51.824 192.257 50.284C189.529 48.7 187.395 46.5 185.855 43.684C184.315 40.824 183.545 37.502 183.545 33.718ZM230.31 11.08C228.682 11.08 227.318 10.574 226.218 9.562C225.162 8.506 224.634 7.208 224.634 5.668C224.634 4.128 225.162 2.852 226.218 1.84C227.318 0.783997 228.682 0.255997 230.31 0.255997C231.938 0.255997 233.28 0.783997 234.336 1.84C235.436 2.852 235.986 4.128 235.986 5.668C235.986 7.208 235.436 8.506 234.336 9.562C233.28 10.574 231.938 11.08 230.31 11.08ZM234.864 15.436V52H225.624V15.436H234.864ZM241.617 33.586C241.617 29.89 242.343 26.612 243.795 23.752C245.291 20.892 247.293 18.692 249.801 17.152C252.353 15.612 255.191 14.842 258.315 14.842C261.043 14.842 263.419 15.392 265.443 16.492C267.511 17.592 269.161 18.978 270.393 20.65V15.436H279.699V52H270.393V46.654C269.205 48.37 267.555 49.8 265.443 50.944C263.375 52.044 260.977 52.594 258.249 52.594C255.169 52.594 252.353 51.802 249.801 50.218C247.293 48.634 245.291 46.412 243.795 43.552C242.343 40.648 241.617 37.326 241.617 33.586ZM270.393 33.718C270.393 31.474 269.953 29.56 269.073 27.976C268.193 26.348 267.005 25.116 265.509 24.28C264.013 23.4 262.407 22.96 260.691 22.96C258.975 22.96 257.391 23.378 255.939 24.214C254.487 25.05 253.299 26.282 252.375 27.91C251.495 29.494 251.055 31.386 251.055 33.586C251.055 35.786 251.495 37.722 252.375 39.394C253.299 41.022 254.487 42.276 255.939 43.156C257.435 44.036 259.019 44.476 260.691 44.476C262.407 44.476 264.013 44.058 265.509 43.222C267.005 42.342 268.193 41.11 269.073 39.526C269.953 37.898 270.393 35.962 270.393 33.718ZM297.964 3.16V52H288.724V3.16H297.964ZM338.726 52.462C335.514 52.462 332.61 51.912 330.014 50.812C327.462 49.712 325.438 48.128 323.942 46.06C322.446 43.992 321.676 41.55 321.632 38.734H331.532C331.664 40.626 332.324 42.122 333.512 43.222C334.744 44.322 336.416 44.872 338.528 44.872C340.684 44.872 342.378 44.366 343.61 43.354C344.842 42.298 345.458 40.934 345.458 39.262C345.458 37.898 345.04 36.776 344.204 35.896C343.368 35.016 342.312 34.334 341.036 33.85C339.804 33.322 338.088 32.75 335.888 32.134C332.896 31.254 330.454 30.396 328.562 29.56C326.714 28.68 325.108 27.382 323.744 25.666C322.424 23.906 321.764 21.574 321.764 18.67C321.764 15.942 322.446 13.566 323.81 11.542C325.174 9.518 327.088 7.978 329.552 6.922C332.016 5.822 334.832 5.272 338 5.272C342.752 5.272 346.602 6.438 349.55 8.77C352.542 11.058 354.192 14.27 354.5 18.406H344.336C344.248 16.822 343.566 15.524 342.29 14.512C341.058 13.456 339.408 12.928 337.34 12.928C335.536 12.928 334.084 13.39 332.984 14.314C331.928 15.238 331.4 16.58 331.4 18.34C331.4 19.572 331.796 20.606 332.588 21.442C333.424 22.234 334.436 22.894 335.624 23.422C336.856 23.906 338.572 24.478 340.772 25.138C343.764 26.018 346.206 26.898 348.098 27.778C349.99 28.658 351.618 29.978 352.982 31.738C354.346 33.498 355.028 35.808 355.028 38.668C355.028 41.132 354.39 43.42 353.114 45.532C351.838 47.644 349.968 49.338 347.504 50.614C345.04 51.846 342.114 52.462 338.726 52.462ZM397.556 15.436V52H388.25V47.38C387.062 48.964 385.5 50.218 383.564 51.142C381.672 52.022 379.604 52.462 377.36 52.462C374.5 52.462 371.97 51.868 369.77 50.68C367.57 49.448 365.832 47.666 364.556 45.334C363.324 42.958 362.708 40.142 362.708 36.886V15.436H371.948V35.566C371.948 38.47 372.674 40.714 374.126 42.298C375.578 43.838 377.558 44.608 380.066 44.608C382.618 44.608 384.62 43.838 386.072 42.298C387.524 40.714 388.25 38.47 388.25 35.566V15.436H397.556ZM452.081 14.908C456.569 14.908 460.177 16.294 462.905 19.066C465.677 21.794 467.063 25.622 467.063 30.55V52H457.823V31.804C457.823 28.944 457.097 26.766 455.645 25.27C454.193 23.73 452.213 22.96 449.705 22.96C447.197 22.96 445.195 23.73 443.699 25.27C442.247 26.766 441.521 28.944 441.521 31.804V52H432.281V31.804C432.281 28.944 431.555 26.766 430.103 25.27C428.651 23.73 426.671 22.96 424.163 22.96C421.611 22.96 419.587 23.73 418.091 25.27C416.639 26.766 415.913 28.944 415.913 31.804V52H406.673V15.436H415.913V19.858C417.101 18.318 418.619 17.108 420.467 16.228C422.359 15.348 424.427 14.908 426.671 14.908C429.531 14.908 432.083 15.524 434.327 16.756C436.571 17.944 438.309 19.66 439.541 21.904C440.729 19.792 442.445 18.098 444.689 16.822C446.977 15.546 449.441 14.908 452.081 14.908ZM521.239 14.908C525.727 14.908 529.335 16.294 532.063 19.066C534.835 21.794 536.221 25.622 536.221 30.55V52H526.981V31.804C526.981 28.944 526.255 26.766 524.803 25.27C523.351 23.73 521.371 22.96 518.863 22.96C516.355 22.96 514.353 23.73 512.857 25.27C511.405 26.766 510.679 28.944 510.679 31.804V52H501.439V31.804C501.439 28.944 500.713 26.766 499.261 25.27C497.809 23.73 495.829 22.96 493.321 22.96C490.769 22.96 488.745 23.73 487.249 25.27C485.797 26.766 485.071 28.944 485.071 31.804V52H475.831V15.436H485.071V19.858C486.259 18.318 487.777 17.108 489.625 16.228C491.517 15.348 493.585 14.908 495.829 14.908C498.689 14.908 501.241 15.524 503.485 16.756C505.729 17.944 507.467 19.66 508.699 21.904C509.887 19.792 511.603 18.098 513.847 16.822C516.135 15.546 518.599 14.908 521.239 14.908ZM542.614 33.586C542.614 29.89 543.34 26.612 544.792 23.752C546.288 20.892 548.29 18.692 550.798 17.152C553.35 15.612 556.188 14.842 559.312 14.842C562.04 14.842 564.416 15.392 566.44 16.492C568.508 17.592 570.158 18.978 571.39 20.65V15.436H580.696V52H571.39V46.654C570.202 48.37 568.552 49.8 566.44 50.944C564.372 52.044 561.974 52.594 559.246 52.594C556.166 52.594 553.35 51.802 550.798 50.218C548.29 48.634 546.288 46.412 544.792 43.552C543.34 40.648 542.614 37.326 542.614 33.586ZM571.39 33.718C571.39 31.474 570.95 29.56 570.07 27.976C569.19 26.348 568.002 25.116 566.506 24.28C565.01 23.4 563.404 22.96 561.688 22.96C559.972 22.96 558.388 23.378 556.936 24.214C555.484 25.05 554.296 26.282 553.372 27.91C552.492 29.494 552.052 31.386 552.052 33.586C552.052 35.786 552.492 37.722 553.372 39.394C554.296 41.022 555.484 42.276 556.936 43.156C558.432 44.036 560.016 44.476 561.688 44.476C563.404 44.476 565.01 44.058 566.506 43.222C568.002 42.342 569.19 41.11 570.07 39.526C570.95 37.898 571.39 35.962 571.39 33.718ZM598.96 21.112C600.148 19.176 601.688 17.658 603.58 16.558C605.516 15.458 607.716 14.908 610.18 14.908V24.61H607.738C604.834 24.61 602.634 25.292 601.138 26.656C599.686 28.02 598.96 30.396 598.96 33.784V52H589.72V15.436H598.96V21.112ZM651.384 15.436L628.746 69.292H618.912L626.832 51.076L612.18 15.436H622.542L631.98 40.978L641.55 15.436H651.384Z" fill="white" />
                            </svg>
                        </Box>
                    </Box>
                </Box>
                <FinancialSummaryComp closingCapital={closingCapital}
                    closingCapitalData={closingCapitalData} currencyFormat={currencyFormat}
                    debtAssumption={debtAssumption} debtAssumptionData={debtAssumptionData}
                    downloadDocs={downloadDocs} performa={proforma} proformaExcels={proformaExcels}
                    proformaImages={proformaImages} proformaPdfs={proformaPdfs} sourceFund={sourceFund}
                    sourceFundData={sourceFundData} isDoc={false} />
            </Page>
        </Document>


    return (
        <Box>
            <Head>
                <title>Financial Summary</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LogiCLoseWebLayout title={'Financial Summary'} queryToken={router.query.token}
                sharedUrl={sharedUrl} randomPass={randomPass}
                editUrl={'/financialSummary/sourceFund'}>
                <Box sx={{ display: "flex", justifyContent: 'flex-end', width: '95%' }}>
                    <Button
                        className='bg-[#469BD3]'
                        type="submit"
                        variant="contained"
                        sx={{
                            marginLeft: "auto",
                            letterSpacing: 1, mt: 2,
                            fontFamily: "Poppins", fontWeight: "600"
                        }}
                        onClick={handlePrint}
                    >
                        Download Pdf
                    </Button>
                </Box>
                <div style={{ display: "none" }}>
                    {PrintComp()}
                </div>
                <FinancialSummaryComp closingCapital={closingCapital}
                    closingCapitalData={closingCapitalData} currencyFormat={currencyFormat}
                    debtAssumption={debtAssumption} debtAssumptionData={debtAssumptionData}
                    downloadDocs={downloadDocs} performa={proforma} proformaExcels={proformaExcels}
                    proformaImages={proformaImages} proformaPdfs={proformaPdfs} sourceFund={sourceFund}
                    sourceFundData={sourceFundData} handleOpen={handleOpen} isDoc={true} />
                {proformaImages.length > 0 &&
                    <ModalSwiper open={open} handleClose={handleClose} imgArr={proformaImages} />
                }
            </LogiCLoseWebLayout>
        </Box>
    )
}

export default FinancialSummary
// export default IsAuthHOC(FinancialSummary, "/webView/financialSummary")


// source/fund unused
{/* <Box className='flex flex-col' sx={{ mt: 3 }}>
                        <Box className='flex flex-row justify-between'>
                            {sourceFund && sourceFund.purchasePrice && sourceFund.purchasePrice.text !== 0 &&
                                sourceFund.purchasePrice.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.purchasePrice && sourceFund.purchasePrice.subtitle
                                            ? sourceFund.purchasePrice.subtitle : 'Purchase Price'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.purchasePrice && sourceFund.purchasePrice.text
                                            ? `$${currencyFormat(sourceFund.purchasePrice.text)}` : '(Purchase Price not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.loanAmount && sourceFund.loanAmount.text !== 0 &&
                                sourceFund.loanAmount.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.loanAmount && sourceFund.loanAmount.subtitle
                                            ? sourceFund.loanAmount.subtitle : 'Loan Amount'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.loanAmount && sourceFund.loanAmount.text
                                            ? `$${currencyFormat(sourceFund.loanAmount.text)}` : '(Loan Amount not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.equity && sourceFund.equity.text !== 0 &&
                                sourceFund.equity.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.equity && sourceFund.equity.subtitle
                                            ? sourceFund.equity.subtitle : 'Equity'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.equity && sourceFund.equity.text
                                            ? `$${currencyFormat(sourceFund.equity.text)}` : '(Equity not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.syndicationFee && sourceFund.syndicationFee.text !== 0 &&
                                sourceFund.syndicationFee.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.syndicationFee && sourceFund.syndicationFee.subtitle
                                            ? sourceFund.syndicationFee.subtitle : 'Syndication Fee'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.syndicationFee && sourceFund.syndicationFee.text
                                            ? `$${currencyFormat(sourceFund.syndicationFee.text)}` : '(syndicationFee not found)'}
                                    </Typography>
                                </Box>
                            }
                        </Box>

                        <Box className='flex flex-row justify-between mt-5'>
                            {sourceFund && sourceFund.capex && sourceFund.capex.text !== null &&
                                sourceFund.capex.text !== 0 &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.capex && sourceFund.capex.subtitle
                                            ? sourceFund.capex.subtitle : 'Capex'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.capex && sourceFund.capex.text
                                            ? `$${currencyFormat(sourceFund.capex.text)}` : '(Capex not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.closingCosts && sourceFund.closingCosts.text !== 0 &&
                                sourceFund.closingCosts.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.closingCosts && sourceFund.closingCosts.subtitle
                                            ? sourceFund.closingCosts.subtitle : 'Closing Costs'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.closingCosts && sourceFund.closingCosts.text
                                            ? `$${currencyFormat(sourceFund.closingCosts.text)}` : '(Closing Costs not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.total && sourceFund.total.text !== 0 &&
                                sourceFund.total.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.total && sourceFund.total.subtitle
                                            ? sourceFund.total.subtitle : 'Total'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.total && sourceFund.total.text
                                            ? `$${currencyFormat(sourceFund.total.text)}` : '(Total Costs not found)'}
                                    </Typography>
                                </Box>
                            }
                            {sourceFund && sourceFund.others && sourceFund.others.text !== 0 && sourceFund.others.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.others && sourceFund.others.subtitle
                                            ? sourceFund.others.subtitle : 'Others'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {sourceFund && sourceFund.others && sourceFund.others.text
                                            ? `$${currencyFormat(sourceFund.others.text)}` : ''}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    </Box> */}


// closing capital unused
{/* <Box className='flex flex-col' sx={{ mt: 3 }}>
                        <Box className='flex flex-row justify-between'>
                            {closingCapital && closingCapital.titleFee && closingCapital.titleFee.text !== 0 &&
                                closingCapital.titleFee.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.titleFee && closingCapital.titleFee.subtitle
                                            ? closingCapital.titleFee.subtitle : 'Title Fee'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.titleFee && closingCapital.titleFee.text
                                            ? `$${currencyFormat(closingCapital.titleFee.text)}` : '(Title Fee not found)'}
                                    </Typography>
                                </Box>
                            }
                            {closingCapital && closingCapital.attorneyFee && closingCapital.attorneyFee.text !== 0 &&
                                closingCapital.attorneyFee.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.attorneyFee && closingCapital.attorneyFee.subtitle
                                            ? closingCapital.attorneyFee.subtitle : 'Attorney Fee'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.attorneyFee && closingCapital.attorneyFee.text
                                            ? `$${currencyFormat(closingCapital.attorneyFee.text)}` : '(Attorney Fee not found)'}
                                    </Typography>
                                </Box>
                            }
                            {closingCapital && closingCapital.brokerfee && closingCapital.brokerfee.text !== 0 &&
                                closingCapital.brokerfee.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.brokerfee && closingCapital.brokerfee.subtitle
                                            ? closingCapital.brokerfee.subtitle : 'Broker Fee'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.brokerfee && closingCapital.brokerfee.text
                                            ? `$${currencyFormat(closingCapital.brokerfee.text)}` : '(Broker Fee not found)'}
                                    </Typography>
                                </Box>
                            }
                        </Box>

                        <Box className='flex flex-row justify-between mt-5'>
                            {closingCapital && closingCapital.bankFee && closingCapital.bankFee.text !== 0 &&
                                closingCapital.bankFee.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.bankFee && closingCapital.bankFee.subtitle
                                            ? closingCapital.bankFee.subtitle : 'Bank Fee'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.bankFee && closingCapital.bankFee.text
                                            ? `$${currencyFormat(closingCapital.bankFee.text)}` : '(Bank Fee not found)'}
                                    </Typography>
                                </Box>
                            }
                            {closingCapital && closingCapital.rateCap && closingCapital.rateCap.text !== 0 &&
                                closingCapital.rateCap.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.rateCap && closingCapital.rateCap.subtitle
                                            ? closingCapital.rateCap.subtitle : 'Rate Cap/3rd Parties'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.rateCap && closingCapital.rateCap.text
                                            ? `$${currencyFormat(closingCapital.rateCap.text)}` : '(Rate Cap not found)'}
                                    </Typography>
                                </Box>
                            }
                            {closingCapital && closingCapital.total && closingCapital.total.text !== 0 &&
                                closingCapital.total.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.total && closingCapital.total.subtitle
                                            ? closingCapital.total.subtitle : 'Total'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.total && closingCapital.total.text
                                            ? `$${currencyFormat(closingCapital.total.text)}` : '(Total cost not found)'}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                        <Box className='flex flex-row justify-between mt-5'>
                            {closingCapital && closingCapital.others && closingCapital.others.text !== 0 &&
                                closingCapital.others.text !== null &&
                                <Box sx={{ width: '30%' }}>
                                    <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.others && closingCapital.others.subtitle
                                            ? closingCapital.others.subtitle : 'Others'}
                                    </Typography>
                                    <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                        {closingCapital && closingCapital.others && closingCapital.others.text
                                            ? `$${currencyFormat(closingCapital.others.text)}` : ''}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    </Box> */}

// loan terms unused
{/* <Box className='flex flex-col' sx={{ mt: 5 }}>
                            <Box className='flex flex-row justify-between'>
                                {debtAssumption && debtAssumption.loanAmount && debtAssumption.loanAmount.text !== 0 &&
                                    debtAssumption.loanAmount.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.loanAmount && debtAssumption.loanAmount.subtitle
                                                ? debtAssumption.loanAmount.subtitle : 'Loan Amount'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.loanAmount && debtAssumption.loanAmount.text
                                                ? `$${currencyFormat(debtAssumption.loanAmount.text)}` : '(Loan Amount not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.interest && debtAssumption.interest.text !== 0 &&
                                    debtAssumption.interest.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.interest && debtAssumption.interest.subtitle
                                                ? debtAssumption.interest.subtitle : 'Interest'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.interest && debtAssumption.interest.text
                                                ? `${debtAssumption.interest.text}%` : '(Interest not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.amortPeriod && debtAssumption.amortPeriod.text !== 0 &&
                                    debtAssumption.amortPeriod.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.amortPeriod && debtAssumption.amortPeriod.subtitle
                                                ? debtAssumption.amortPeriod.subtitle : 'Amort Period'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.amortPeriod && debtAssumption.amortPeriod.text
                                                ? `${debtAssumption.amortPeriod.text}` : '(Amort Period not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.constant && debtAssumption.constant.text !== 0 &&
                                    debtAssumption.constant.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.constant && debtAssumption.constant.subtitle
                                                ? debtAssumption.constant.subtitle : 'Constant'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.constant && debtAssumption.constant.text
                                                ? `${debtAssumption.constant.text}%` : '(Constant not found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {debtAssumption && debtAssumption.annualDebtService && debtAssumption.annualDebtService.text !== 0 &&
                                    debtAssumption.annualDebtService.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.annualDebtService && debtAssumption.annualDebtService.subtitle
                                                ? debtAssumption.annualDebtService.subtitle : 'Annual Debt Service'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.annualDebtService && debtAssumption.annualDebtService.text
                                                ? `$${currencyFormat(debtAssumption.annualDebtService.text)}` : '(Annual Debt Service not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.dscr && debtAssumption.dscr.text !== 0 &&
                                    debtAssumption.dscr.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.dscr && debtAssumption.dscr.subtitle
                                                ? debtAssumption.dscr.subtitle : 'DSCR Service'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.dscr && debtAssumption.dscr.text
                                                ? `${debtAssumption.dscr.text}` : '(DSCR not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.ltv && debtAssumption.ltv.text !== 0 &&
                                    debtAssumption.ltv.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.ltv && debtAssumption.ltv.subtitle
                                                ? debtAssumption.ltv.subtitle : 'LTV'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.ltv && debtAssumption.ltv.text
                                                ? `${debtAssumption.ltv.text}%` : '(LTV not found)'}
                                        </Typography>
                                    </Box>
                                }
                                {debtAssumption && debtAssumption.refinanceYear && debtAssumption.refinanceYear.text !== 0 &&
                                    debtAssumption.refinanceYear.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.refinanceYear && debtAssumption.refinanceYear.subtitle
                                                ? debtAssumption.refinanceYear.subtitle : 'Refinance Year'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.refinanceYear && debtAssumption.refinanceYear.text
                                                ? `${debtAssumption.refinanceYear.text}` : '(Refinance Year not found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                            <Box className='flex flex-row justify-between mt-5'>
                                {debtAssumption && debtAssumption.others && debtAssumption.others.text !== 0 &&
                                    debtAssumption.others.text !== null &&
                                    <Box sx={{ width: '40%' }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.others && debtAssumption.others.subtitle
                                                ? debtAssumption.others.subtitle : 'Others'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#FFFFFF", opacity: 0.7, fontWeight: 400, fontFamily: "Poppins" }}>
                                            {debtAssumption && debtAssumption.others && debtAssumption.others.text
                                                ? `${debtAssumption.others.text}` : ''}
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                        </Box> */}