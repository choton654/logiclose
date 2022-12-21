import React, { useState, useRef } from 'react'
import Head from 'next/head'
import Image from "next/image"
import dynamic from "next/dynamic"
import { Box, Typography, Button } from "@mui/material"
import { useReactToPrint } from 'react-to-print'
import IsAuthHOC from '../../components/IsAuthHOC'
import { FreeMode, Navigation, Thumbs } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import circleImage from "../../../public/WebView/DoubleCircle.png"
import boxImage from "../../../public/WebView/Boxes.png"
import executiveSummaryPDF from "../../../public/WebView/ExecutiveSummaryPDF.png"
import logoPDF from "../../../public/WebView/LogoPDF.png"
import Loader from '../../components/Loader'
import { getData } from '../../utils/localStorage'
import { useGetDemographicSummaryQuery, useGetInvestmentOpportunityQuery, useGetInvestmentSummaryQuery } from '../../services/query'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { BASE_URL } from '../../utils/api'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import DemographicSummary from '../../components/summary/demographicSummary'
import InvestmentSummary from '../../components/summary/investmentSummary'
import InvestmentOppurtunity from '../../components/summary/investmentOppurtunity'

// https://storage.googleapis.com/logiclose/AboutPDF.png
// https://storage.googleapis.com/logiclose/ExitScenariosPDF.png
// https://storage.googleapis.com/logiclose/FinancialSUmmaryPDF.png
// https://storage.googleapis.com/logiclose/LocationOverviewPDF.png
// https://storage.googleapis.com/logiclose/PropertyDescriptionPDF.png

const LogiCLoseWebLayout = dynamic(
    () => import("../../components/Logiclose/LogiCLoseWebLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const ExecutiveSummaryComp = ({
    summaryData, opportunityData, demographicData, isPrint
}) => {
    return (
        <div>
            <Box className='flex flex-col rounded-3xl mt-6 mx-4 p-6 bg-gray-100'>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {summaryData !== undefined ? summaryData.title : 'Investment Summary'}
                </Typography>
                {summaryData !== undefined && summaryData.descriptionArr.length > 0 &&
                    summaryData.descriptionArr.map((item, idx) =>
                        <Typography key={idx} variant='subtitle2' mt={2} sx={{ mt: 2, color: '#868585', fontFamily: "Poppins", lineHeight: 2 }}>
                            {item}
                        </Typography>
                    )
                }
            </Box>
            {opportunityData !== undefined && opportunityData.descriptionArr.length > 0 && opportunityData.descriptionArr[0] &&
                <Box className='mt-6'>
                    <Box className='flex flex-col rounded-3xl mx-4 p-6 bg-[#ECF6FF]'>
                        <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                            {opportunityData !== undefined ? opportunityData.title : 'Investment Oppurtunity'}
                        </Typography>
                        {opportunityData?.descriptionArr.map((item, idx) =>
                            <Typography key={idx} variant='subtitle2' mt={2} sx={{ mt: 2, color: '#868585', fontFamily: "Poppins", lineHeight: 2 }}>
                                {item}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex", justifyContent: "space-between",
                        height: 100, width: "98%",
                        marginLeft: 'auto', marginRight: "auto"
                    }}>
                        <Box sx={{ height: 80, width: 300, ml: 4 }}>
                            <Image src={boxImage} layout='responsive' />
                        </Box>
                        <Image src={circleImage} width={200} height={100} />
                    </Box>
                </Box>
            }

            <Box className='flex flex-row rounded-3xl mt-6 mx-4 p-6 justify-between'>
                {demographicData !== undefined && demographicData.images.length > 0 &&
                    <Box className='mb-6 z-20' sx={{ width: '40%' }}>
                        <Swiper
                            style={{
                                "--swiper-navigation-color": "#469BD3",
                                "--swiper-pagination-color": "#469BD3",
                                height: 300
                            }}
                            spaceBetween={10}
                            navigation={true}
                            // thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="h-1/4 cursor-pointer"
                        >
                            {demographicData.images.map((item, idx) =>
                                <SwiperSlide key={idx}>
                                    <img
                                        src={item}
                                        style={{
                                            display: 'block',
                                            borderRadius: 5,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                        alt={`img${idx}`}
                                    />
                                </SwiperSlide>
                            )}
                        </Swiper>
                        {!isPrint ?
                            <Swiper
                                // onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mt-3 cursor-pointer"
                            >
                                {demographicData.images.length > 0 && demographicData.images.map((item, idx) =>
                                    <SwiperSlide key={idx}>
                                        <img
                                            src={item}
                                            style={{
                                                display: 'block',
                                                borderRadius: 5,
                                                width: '100%',
                                                height: '100%'
                                            }}
                                            alt={`img${idx}`}
                                        />
                                    </SwiperSlide>
                                )}
                            </Swiper>
                            :
                            <Box className='flex flex-row' sx={{ width: '40%' }}>
                                {demographicData.images.length > 0 && demographicData.images.slice(0, 3).map((item, idx) =>
                                    <img key={idx}
                                        src={item}
                                        style={{
                                            display: 'block',
                                            borderRadius: 5,
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        alt={`img${idx}`}
                                    />
                                )}
                            </Box>
                        }
                    </Box>
                }

                {demographicData !== undefined && demographicData.descriptionArr.length > 0 && demographicData.descriptionArr[0] &&
                    <Box sx={{ ml: 6, width: '60%' }}>
                        <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                            {demographicData !== undefined ? demographicData.title : 'Demographic Summary'}
                        </Typography>
                        {demographicData.descriptionArr.map((item, idx) =>
                            <Typography key={idx} variant='subtitle2' mt={2} sx={{ mt: 2, color: '#868585', fontFamily: "Poppins", lineHeight: 2 }}>
                                {item}
                            </Typography>
                        )}
                    </Box>
                }
            </Box>
        </div>
    )
}

const ExecutiveSummary = () => {

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

    const [thumbsSwiper, setThumbsSwiper] = useState(null);


    const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useGetInvestmentSummaryQuery(token)
    const { data: opportunityData, isLoading: opportunityLoading, error: opportunityError } = useGetInvestmentOpportunityQuery(token)
    const { data: demographicData, isLoading: demographicLoading, error: demographicError } = useGetDemographicSummaryQuery(token)

    const randomPass = useMemo(() => Math.floor(1000 + Math.random() * 9000), [token])
    const sharedUrl = useMemo(() =>
        `${BASE_URL}/webView/executiveSummary?token=${token}____${randomPass}`
        , [BASE_URL, token])

    const PrintComp = () =>
        <Document ref={componentRef}>
            <Page size="A4" style={{
                flexDirection: 'column',
                backgroundColor: '#fff'
            }} orientation="portrait">
                <Box sx={{ width: '100%', mb: 4 }}>
                    <img
                        src={'https://storage.googleapis.com/logiclose/ExecutiveSummaryPDF.png'}
                        style={{
                            display: 'block',
                            objectFit: 'contain'
                        }}
                        alt={`img`}
                    />
                    <Box sx={{ position: "absolute", top: 15, left: "40%", width: 200 }}>
                        <img
                            src={'https://storage.googleapis.com/logiclose/LogoPDF.png'}
                            style={{
                                display: 'block',
                                objectFit: 'contain'
                            }}
                            alt={`img`}
                        />
                    </Box>
                    <Box sx={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        position: "absolute", top: '20%', left: "30%", width: 350
                    }}>
                        <Box sx={{ position: "relative" }}>
                            <svg width="182" height="131" viewBox="0 0 182 131" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.9168 122.584L19.5895 124.3L20.9168 122.584ZM5.45397 100.249L3.40686 100.967L3.41251 100.983L3.41841 100.999L5.45397 100.249ZM6.02667 32.2886L8.04448 33.0851L8.04798 33.0761L6.02667 32.2886ZM21.6804 9.18978L23.0817 10.8458L23.0845 10.8434L21.6804 9.18978ZM84.6773 30.9523L82.6301 31.6701L82.6358 31.6862L82.6417 31.7023L84.6773 30.9523ZM84.2955 98.9125L86.3133 99.709L86.3168 99.7001L84.2955 98.9125ZM68.4508 122.011L69.8365 123.68L69.8457 123.673L69.8548 123.665L68.4508 122.011ZM57.7604 114.757L55.8906 113.657L55.8785 113.678L55.8667 113.699L57.7604 114.757ZM63.4874 97.0035L65.6262 97.3661L63.4874 97.0035ZM62.9147 39.7337L60.7781 40.109L60.779 40.114L62.9147 39.7337ZM55.2787 17.5894L53.4342 18.7312L53.444 18.7469L53.454 18.7624L55.2787 17.5894ZM32.7526 15.8713L30.9224 14.7066L30.9097 14.7266L30.8974 14.7469L32.7526 15.8713ZM26.8347 33.434L24.7021 33.0364L24.6994 33.0509L24.6969 33.0654L26.8347 33.434ZM27.4074 91.2766L25.2708 91.6519L25.2717 91.6569L27.4074 91.2766ZM35.0434 113.23L33.2186 114.403L33.2284 114.418L33.2384 114.433L35.0434 113.23ZM45.1611 128.242C36.1707 128.242 28.5693 125.761 22.2442 120.868L19.5895 124.3C26.7546 129.843 35.316 132.58 45.1611 132.58V128.242ZM22.2442 120.868C15.8826 115.947 10.9418 108.869 7.48953 99.4989L3.41841 100.999C7.09306 110.973 12.4608 118.785 19.5895 124.3L22.2442 120.868ZM7.50108 99.531C4.1652 90.0176 2.469 78.6902 2.469 65.5051H-1.86963C-1.86963 79.046 -0.129643 90.8811 3.40686 100.967L7.50108 99.531ZM2.469 65.5051C2.469 53.2526 4.34438 42.4586 8.04446 33.0851L4.00887 31.4921C0.0729709 41.4631 -1.86963 52.8134 -1.86963 65.5051H2.469ZM8.04798 33.0761C11.7626 23.542 16.7926 16.1673 23.0817 10.8458L20.2792 7.53376C13.3326 13.4117 7.92674 21.4362 4.00535 31.5011L8.04798 33.0761ZM23.0845 10.8434C29.4346 5.45183 36.7629 2.76861 45.1611 2.76861V-1.57001C35.7419 -1.57001 27.4165 1.47376 20.2764 7.53613L23.0845 10.8434ZM45.1611 2.76861C54.1514 2.76861 61.7528 5.24897 68.0779 10.142L70.7326 6.71035C63.5676 1.16756 55.0062 -1.57001 45.1611 -1.57001V2.76861ZM68.0779 10.142C74.426 15.0528 79.3021 22.1791 82.6301 31.6701L86.7244 30.2345C83.18 20.1265 77.8748 12.2354 70.7326 6.71035L68.0779 10.142ZM82.6417 31.7023C86.0948 41.075 87.8531 52.3261 87.8531 65.5051H92.1917C92.1917 51.9582 90.3866 40.1741 86.7128 30.2024L82.6417 31.7023ZM87.8531 65.5051C87.8531 77.7568 85.978 88.6185 82.2741 98.125L86.3168 99.7001C90.2489 89.6076 92.1917 78.1976 92.1917 65.5051H87.8531ZM82.2777 98.116C78.5677 107.515 73.4759 114.899 67.0468 120.358L69.8548 123.665C76.9159 117.67 82.3872 109.655 86.3133 99.709L82.2777 98.116ZM67.0651 120.342C60.7101 125.618 53.4373 128.242 45.1611 128.242V132.58C54.4476 132.58 62.7012 129.604 69.8365 123.68L67.0651 120.342ZM48.5973 123.417C53.3399 123.417 57.0029 120.56 59.6541 115.815L55.8667 113.699C53.6818 117.609 51.236 119.078 48.5973 119.078V123.417ZM59.6302 115.857C62.3598 111.217 64.3299 105.014 65.6262 97.3661L61.3486 96.641C60.0996 104.01 58.2517 109.644 55.8906 113.657L59.6302 115.857ZM65.6262 97.3661C66.9235 89.712 67.5657 81.0605 67.5657 71.423H63.2271C63.2271 80.8755 62.5966 89.2776 61.3486 96.641L65.6262 97.3661ZM67.5657 71.423C67.5657 59.4903 66.732 48.7962 65.0504 39.3534L60.779 40.114C62.4063 49.252 63.2271 59.6842 63.2271 71.423H67.5657ZM65.0513 39.3583C63.3697 29.7864 60.7538 22.0945 57.1035 16.4163L53.454 18.7624C56.676 23.7746 59.1508 30.8456 60.7781 40.109L65.0513 39.3583ZM57.1232 16.4475C53.5005 10.5955 48.5371 7.40226 42.2976 7.40226V11.7409C46.7484 11.7409 50.4391 13.8929 53.4342 18.7312L57.1232 16.4475ZM42.2976 7.40226C37.6169 7.40226 33.8386 10.124 30.9224 14.7066L34.5828 17.0359C37.0118 13.2189 39.5968 11.7409 42.2976 11.7409V7.40226ZM30.8974 14.7469C28.1628 19.2589 26.1263 25.3975 24.7021 33.0364L28.9673 33.8316C30.3429 26.4531 32.2517 20.8831 34.6078 16.9956L30.8974 14.7469ZM24.6969 33.0654C23.398 40.5991 22.7564 49.3178 22.7564 59.2054H27.095C27.095 49.4941 27.7261 41.0318 28.9725 33.8026L24.6969 33.0654ZM22.7564 59.2054C22.7564 71.2645 23.59 82.084 25.2708 91.6519L29.544 90.9012C27.9159 81.6337 27.095 71.0724 27.095 59.2054H22.7564ZM25.2717 91.6569C26.9543 101.105 29.5712 108.729 33.2186 114.403L36.8682 112.057C33.6432 107.04 31.1695 100.029 29.5431 90.8962L25.2717 91.6569ZM33.2384 114.433C37.1233 120.261 42.2648 123.417 48.5973 123.417V119.078C43.9848 119.078 40.0904 116.89 36.8484 112.027L33.2384 114.433ZM124.982 128.502H122.813V130.671H124.982V128.502ZM124.982 125.448L124.18 123.432L122.813 123.976V125.448H124.982ZM142.736 118.384L143.538 120.4L144.905 119.856V118.384H142.736ZM142.736 23.1254H144.905V19.7071L141.812 21.1626L142.736 23.1254ZM110.283 38.3974H108.114V41.8158L111.207 40.3602L110.283 38.3974ZM110.283 31.1432L109.154 29.2911L108.114 29.9252V31.1432H110.283ZM157.244 2.50829V0.338982H156.635L156.115 0.656144L157.244 2.50829ZM165.835 2.50829H168.004V0.338982H165.835V2.50829ZM165.835 118.384H163.666V119.792L164.952 120.366L165.835 118.384ZM181.68 125.448H183.849V124.04L182.563 123.466L181.68 125.448ZM181.68 128.502V130.671H183.849V128.502H181.68ZM127.152 128.502V125.448H122.813V128.502H127.152ZM125.784 127.463L143.538 120.4L141.934 116.369L124.18 123.432L125.784 127.463ZM144.905 118.384V23.1254H140.567V118.384H144.905ZM141.812 21.1626L109.359 36.4346L111.207 40.3602L143.66 25.0883L141.812 21.1626ZM112.452 38.3974V31.1432H108.114V38.3974H112.452ZM111.412 32.9954L158.374 4.36045L156.115 0.656144L109.154 29.2911L111.412 32.9954ZM157.244 4.67761H165.835V0.338982H157.244V4.67761ZM163.666 2.50829V118.384H168.004V2.50829H163.666ZM164.952 120.366L180.796 127.429L182.563 123.466L166.718 116.403L164.952 120.366ZM179.51 125.448V128.502H183.849V125.448H179.51ZM181.68 126.333H124.982V130.671H181.68V126.333Z" fill="url(#paint0_linear_806_7978)" />
                                <defs>
                                    <linearGradient id="paint0_linear_806_7978" x1="96.5" y1="-5.49805" x2="96.5" y2="128.999" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="white" />
                                        <stop offset="1" stop-color="white" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg style={{ position: "absolute", bottom: -20, left: -100 }} width="400" height="70" viewBox="0 0 664 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.794 13.39V24.94H25.304V32.266H9.794V44.476H27.284V52H0.554V5.866H27.284V13.39H9.794ZM55.877 52L48.353 40.648L41.687 52H31.787L43.733 33.652L31.655 15.436H42.083L49.541 26.722L56.273 15.436H66.173L54.161 33.652L66.305 52H55.877ZM105.314 32.926C105.314 34.246 105.226 35.434 105.05 36.49H78.3195C78.5395 39.13 79.4635 41.198 81.0915 42.694C82.7195 44.19 84.7215 44.938 87.0975 44.938C90.5295 44.938 92.9715 43.464 94.4235 40.516H104.39C103.334 44.036 101.31 46.94 98.3175 49.228C95.3255 51.472 91.6515 52.594 87.2955 52.594C83.7755 52.594 80.6075 51.824 77.7915 50.284C75.0195 48.7 72.8415 46.478 71.2575 43.618C69.7175 40.758 68.9475 37.458 68.9475 33.718C68.9475 29.934 69.7175 26.612 71.2575 23.752C72.7975 20.892 74.9535 18.692 77.7255 17.152C80.4975 15.612 83.6875 14.842 87.2955 14.842C90.7715 14.842 93.8735 15.59 96.6015 17.086C99.3735 18.582 101.508 20.716 103.004 23.488C104.544 26.216 105.314 29.362 105.314 32.926ZM95.7435 30.286C95.6995 27.91 94.8415 26.018 93.1695 24.61C91.4975 23.158 89.4515 22.432 87.0315 22.432C84.7435 22.432 82.8075 23.136 81.2235 24.544C79.6835 25.908 78.7375 27.822 78.3855 30.286H95.7435ZM109.682 33.718C109.682 29.934 110.452 26.634 111.992 23.818C113.532 20.958 115.666 18.758 118.394 17.218C121.122 15.634 124.246 14.842 127.766 14.842C132.298 14.842 136.038 15.986 138.986 18.274C141.978 20.518 143.98 23.686 144.992 27.778H135.026C134.498 26.194 133.596 24.962 132.32 24.082C131.088 23.158 129.548 22.696 127.7 22.696C125.06 22.696 122.97 23.664 121.43 25.6C119.89 27.492 119.12 30.198 119.12 33.718C119.12 37.194 119.89 39.9 121.43 41.836C122.97 43.728 125.06 44.674 127.7 44.674C131.44 44.674 133.882 43.002 135.026 39.658H144.992C143.98 43.618 141.978 46.764 138.986 49.096C135.994 51.428 132.254 52.594 127.766 52.594C124.246 52.594 121.122 51.824 118.394 50.284C115.666 48.7 113.532 46.5 111.992 43.684C110.452 40.824 109.682 37.502 109.682 33.718ZM186.279 15.436V52H176.973V47.38C175.785 48.964 174.223 50.218 172.287 51.142C170.395 52.022 168.327 52.462 166.083 52.462C163.223 52.462 160.693 51.868 158.493 50.68C156.293 49.448 154.555 47.666 153.279 45.334C152.047 42.958 151.431 40.142 151.431 36.886V15.436H160.671V35.566C160.671 38.47 161.397 40.714 162.849 42.298C164.301 43.838 166.281 44.608 168.789 44.608C171.341 44.608 173.343 43.838 174.795 42.298C176.247 40.714 176.973 38.47 176.973 35.566V15.436H186.279ZM206.154 23.026V40.714C206.154 41.946 206.44 42.848 207.012 43.42C207.628 43.948 208.64 44.212 210.048 44.212H214.338V52H208.53C200.742 52 196.848 48.216 196.848 40.648V23.026H192.492V15.436H196.848V6.394H206.154V15.436H214.338V23.026H206.154ZM225.67 11.08C224.042 11.08 222.678 10.574 221.578 9.562C220.522 8.506 219.994 7.208 219.994 5.668C219.994 4.128 220.522 2.852 221.578 1.84C222.678 0.783997 224.042 0.255997 225.67 0.255997C227.298 0.255997 228.64 0.783997 229.696 1.84C230.796 2.852 231.346 4.128 231.346 5.668C231.346 7.208 230.796 8.506 229.696 9.562C228.64 10.574 227.298 11.08 225.67 11.08ZM230.224 15.436V52H220.984V15.436H230.224ZM254.599 43.486L263.839 15.436H273.673L260.143 52H248.923L235.459 15.436H245.359L254.599 43.486ZM312.853 32.926C312.853 34.246 312.765 35.434 312.589 36.49H285.859C286.079 39.13 287.003 41.198 288.631 42.694C290.259 44.19 292.261 44.938 294.637 44.938C298.069 44.938 300.511 43.464 301.963 40.516H311.929C310.873 44.036 308.849 46.94 305.857 49.228C302.865 51.472 299.191 52.594 294.835 52.594C291.315 52.594 288.147 51.824 285.331 50.284C282.559 48.7 280.381 46.478 278.797 43.618C277.257 40.758 276.487 37.458 276.487 33.718C276.487 29.934 277.257 26.612 278.797 23.752C280.337 20.892 282.493 18.692 285.265 17.152C288.037 15.612 291.227 14.842 294.835 14.842C298.311 14.842 301.413 15.59 304.141 17.086C306.913 18.582 309.047 20.716 310.543 23.488C312.083 26.216 312.853 29.362 312.853 32.926ZM303.283 30.286C303.239 27.91 302.381 26.018 300.709 24.61C299.037 23.158 296.991 22.432 294.571 22.432C292.283 22.432 290.347 23.136 288.763 24.544C287.223 25.908 286.277 27.822 285.925 30.286H303.283ZM351.23 52.462C348.018 52.462 345.114 51.912 342.518 50.812C339.966 49.712 337.942 48.128 336.446 46.06C334.95 43.992 334.18 41.55 334.136 38.734H344.036C344.168 40.626 344.828 42.122 346.016 43.222C347.248 44.322 348.92 44.872 351.032 44.872C353.188 44.872 354.882 44.366 356.114 43.354C357.346 42.298 357.962 40.934 357.962 39.262C357.962 37.898 357.544 36.776 356.708 35.896C355.872 35.016 354.816 34.334 353.54 33.85C352.308 33.322 350.592 32.75 348.392 32.134C345.4 31.254 342.958 30.396 341.066 29.56C339.218 28.68 337.612 27.382 336.248 25.666C334.928 23.906 334.268 21.574 334.268 18.67C334.268 15.942 334.95 13.566 336.314 11.542C337.678 9.518 339.592 7.978 342.056 6.922C344.52 5.822 347.336 5.272 350.504 5.272C355.256 5.272 359.106 6.438 362.054 8.77C365.046 11.058 366.696 14.27 367.004 18.406H356.84C356.752 16.822 356.07 15.524 354.794 14.512C353.562 13.456 351.912 12.928 349.844 12.928C348.04 12.928 346.588 13.39 345.488 14.314C344.432 15.238 343.904 16.58 343.904 18.34C343.904 19.572 344.3 20.606 345.092 21.442C345.928 22.234 346.94 22.894 348.128 23.422C349.36 23.906 351.076 24.478 353.276 25.138C356.268 26.018 358.71 26.898 360.602 27.778C362.494 28.658 364.122 29.978 365.486 31.738C366.85 33.498 367.532 35.808 367.532 38.668C367.532 41.132 366.894 43.42 365.618 45.532C364.342 47.644 362.472 49.338 360.008 50.614C357.544 51.846 354.618 52.462 351.23 52.462ZM410.06 15.436V52H400.754V47.38C399.566 48.964 398.004 50.218 396.068 51.142C394.176 52.022 392.108 52.462 389.864 52.462C387.004 52.462 384.474 51.868 382.274 50.68C380.074 49.448 378.336 47.666 377.06 45.334C375.828 42.958 375.212 40.142 375.212 36.886V15.436H384.452V35.566C384.452 38.47 385.178 40.714 386.63 42.298C388.082 43.838 390.062 44.608 392.57 44.608C395.122 44.608 397.124 43.838 398.576 42.298C400.028 40.714 400.754 38.47 400.754 35.566V15.436H410.06ZM464.585 14.908C469.073 14.908 472.681 16.294 475.409 19.066C478.181 21.794 479.567 25.622 479.567 30.55V52H470.327V31.804C470.327 28.944 469.601 26.766 468.149 25.27C466.697 23.73 464.717 22.96 462.209 22.96C459.701 22.96 457.699 23.73 456.203 25.27C454.751 26.766 454.025 28.944 454.025 31.804V52H444.785V31.804C444.785 28.944 444.059 26.766 442.607 25.27C441.155 23.73 439.175 22.96 436.667 22.96C434.115 22.96 432.091 23.73 430.595 25.27C429.143 26.766 428.417 28.944 428.417 31.804V52H419.177V15.436H428.417V19.858C429.605 18.318 431.123 17.108 432.971 16.228C434.863 15.348 436.931 14.908 439.175 14.908C442.035 14.908 444.587 15.524 446.831 16.756C449.075 17.944 450.813 19.66 452.045 21.904C453.233 19.792 454.949 18.098 457.193 16.822C459.481 15.546 461.945 14.908 464.585 14.908ZM533.743 14.908C538.231 14.908 541.839 16.294 544.567 19.066C547.339 21.794 548.725 25.622 548.725 30.55V52H539.485V31.804C539.485 28.944 538.759 26.766 537.307 25.27C535.855 23.73 533.875 22.96 531.367 22.96C528.859 22.96 526.857 23.73 525.361 25.27C523.909 26.766 523.183 28.944 523.183 31.804V52H513.943V31.804C513.943 28.944 513.217 26.766 511.765 25.27C510.313 23.73 508.333 22.96 505.825 22.96C503.273 22.96 501.249 23.73 499.753 25.27C498.301 26.766 497.575 28.944 497.575 31.804V52H488.335V15.436H497.575V19.858C498.763 18.318 500.281 17.108 502.129 16.228C504.021 15.348 506.089 14.908 508.333 14.908C511.193 14.908 513.745 15.524 515.989 16.756C518.233 17.944 519.971 19.66 521.203 21.904C522.391 19.792 524.107 18.098 526.351 16.822C528.639 15.546 531.103 14.908 533.743 14.908ZM555.117 33.586C555.117 29.89 555.843 26.612 557.295 23.752C558.791 20.892 560.793 18.692 563.301 17.152C565.853 15.612 568.691 14.842 571.815 14.842C574.543 14.842 576.919 15.392 578.943 16.492C581.011 17.592 582.661 18.978 583.893 20.65V15.436H593.199V52H583.893V46.654C582.705 48.37 581.055 49.8 578.943 50.944C576.875 52.044 574.477 52.594 571.749 52.594C568.669 52.594 565.853 51.802 563.301 50.218C560.793 48.634 558.791 46.412 557.295 43.552C555.843 40.648 555.117 37.326 555.117 33.586ZM583.893 33.718C583.893 31.474 583.453 29.56 582.573 27.976C581.693 26.348 580.505 25.116 579.009 24.28C577.513 23.4 575.907 22.96 574.191 22.96C572.475 22.96 570.891 23.378 569.439 24.214C567.987 25.05 566.799 26.282 565.875 27.91C564.995 29.494 564.555 31.386 564.555 33.586C564.555 35.786 564.995 37.722 565.875 39.394C566.799 41.022 567.987 42.276 569.439 43.156C570.935 44.036 572.519 44.476 574.191 44.476C575.907 44.476 577.513 44.058 579.009 43.222C580.505 42.342 581.693 41.11 582.573 39.526C583.453 37.898 583.893 35.962 583.893 33.718ZM611.464 21.112C612.652 19.176 614.192 17.658 616.084 16.558C618.02 15.458 620.22 14.908 622.684 14.908V24.61H620.242C617.338 24.61 615.138 25.292 613.642 26.656C612.19 28.02 611.464 30.396 611.464 33.784V52H602.224V15.436H611.464V21.112ZM663.888 15.436L641.25 69.292H631.416L639.336 51.076L624.684 15.436H635.046L644.484 40.978L654.054 15.436H663.888Z" fill="white" />
                            </svg>
                        </Box>
                    </Box>
                </Box>
                {/* <ExecutiveSummaryComp summaryData={summaryData} opportunityData={opportunityData}
                    demographicData={demographicData} thumbsSwiper={thumbsSwiper}
                    setThumbsSwiper={setThumbsSwiper} isPrint={true} /> */}
                {demographicData !== undefined && summaryData !== undefined &&
                    opportunityData !== undefined &&
                    <Box sx={{ flex: 1, backgroundColor: "#fff", px: 10 }}>
                        <InvestmentSummary summaryData={summaryData} />
                        <InvestmentOppurtunity opportunityData={opportunityData} />
                        <DemographicSummary demographicData={demographicData} />
                    </Box>
                }
            </Page>
        </Document>

    return (
        <Box>
            <Head>
                <title>Executive Summary</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LogiCLoseWebLayout title={'Executive Summary'} queryToken={router.query.token}
                sharedUrl={sharedUrl} randomPass={randomPass}
                editUrl={'/executiveSummary/investmentSummary'}>
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
                <div>
                    <ExecutiveSummaryComp summaryData={summaryData} opportunityData={opportunityData}
                        demographicData={demographicData} thumbsSwiper={thumbsSwiper}
                        setThumbsSwiper={setThumbsSwiper} isPrint={false} />
                </div>
            </LogiCLoseWebLayout>
        </Box>
    )
}

export default ExecutiveSummary
// export default IsAuthHOC(ExecutiveSummary, '/webView/executiveSummary')

