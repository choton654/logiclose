import { Box, Typography, Grid, Button } from '@mui/material'
import dynamic from 'next/dynamic';
import Head from 'next/head'
import React, { useRef, useMemo } from 'react'
import Loader from '../../components/Loader';
import floorBackground from "../../../public/WebView/FloorBack.png"
import Image from 'next/image';
import { useGetRefinanceScenarioQuery, useGetSaleScenarioQuery } from '../../services/query';
import { getData } from '../../utils/localStorage';
import IsAuthHOC from '../../components/IsAuthHOC'
import { useRouter } from 'next/router';
import { BASE_URL } from '../../utils/api';
import { useReactToPrint } from 'react-to-print'
import { Page, Document } from '@react-pdf/renderer'

const LogiCLoseWebLayout = dynamic(
    () => import("../../components/Logiclose/LogiCLoseWebLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const ExitScenariosComp = ({
    saleScenario, saleScenarioData, refiScenario, refiScenarioData
}) => {
    return (
        <div>
            <Box className='flex flex-col mt-4 py-6 pl-6'>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {saleScenario ? saleScenario.title : 'Sale Scenario'}
                </Typography>
                <Box className='flex flex-row justify-between'>
                    <Box className='flex flex-col w-4/6 mt-6 bg-[#f8fafc]
               px-4 pb-8 pt-2 rounded-xl'>
                        {saleScenario &&
                            <Grid container component="main">
                                {saleScenarioData.map((item, idx) =>
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
                                            {item.text}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        }
                    </Box>
                    {/* <Box sx={{ width: '30%', mt: 4 }}>
                    <Image src={floorBackground} layout='responsive' />
                </Box> */}
                </Box>
            </Box>

            <Box className='flex flex-col mt-4 py-6 pl-6'>
                <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                    {refiScenario ? refiScenario.title : 'Refinance Scenario'}
                </Typography>
                <Box className='flex flex-row justify-between'>
                    <Box className='flex flex-col w-4/6 mt-6 bg-[#ECF6FF]
               px-4 pb-8 pt-2 rounded-xl'>
                        {refiScenario &&
                            <Grid container component="main">
                                {refiScenarioData.map((item, idx) =>
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
                                            {item.text}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        }
                    </Box>
                    {/* <Box sx={{ width: '30%', mt: 4 }}>
                    <Image src={floorBackground} layout='responsive' />
                </Box> */}
                </Box>
            </Box>
        </div>
    )
}

const ExitScenarios = () => {

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
    const { data: saleScenario, isLoading: getting1, error: error1 } = useGetSaleScenarioQuery(token)
    const { data: refiScenario, isLoading: getting2, error: error2 } = useGetRefinanceScenarioQuery(token)

    const randomPass = useMemo(() => Math.floor(1000 + Math.random() * 9000), [token])
    const sharedUrl = useMemo(() =>
        `${BASE_URL}/webView/exitScenarios?token=${token}____${randomPass}`
        , [BASE_URL, token])

    const saleScenarioData = useMemo(() => {
        if (!saleScenario) {
            return []
        }
        const { createdAt, isStepCompleted, title, updatedAt, userId, __v, _id, ...rest } = saleScenario
        return Object.keys(rest).filter(item =>
            saleScenario[item].text)
            .map(item => saleScenario[item])
    }, [saleScenario])

    const refiScenarioData = useMemo(() => {
        if (!refiScenario) {
            return []
        }
        const { createdAt, isStepCompleted, title, updatedAt, userId, __v, _id, ...rest } = refiScenario
        return Object.keys(rest).filter(item =>
            refiScenario[item].text)
            .map(item => refiScenario[item])
    }, [refiScenario])

    const PrintComp = () =>
        <Document ref={componentRef}>
            <Page size="A4" style={{
                flexDirection: 'column',
                backgroundColor: '#fff'
            }} orientation="portrait">
                <Box sx={{ width: '100%', mb: 4 }}>
                    <img
                        src={'https://storage.googleapis.com/logiclose/ExitScenariosPDF.png'}
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
                            <svg width="188" height="131" viewBox="0 0 188 131" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.9168 122.584L19.5895 124.3L20.9168 122.584ZM5.45397 100.249L3.40686 100.967L3.41251 100.983L3.41841 100.999L5.45397 100.249ZM6.02667 32.2886L8.04448 33.0851L8.04798 33.0761L6.02667 32.2886ZM21.6804 9.18978L23.0817 10.8458L23.0845 10.8434L21.6804 9.18978ZM84.6773 30.9523L82.6301 31.6701L82.6358 31.6862L82.6417 31.7023L84.6773 30.9523ZM84.2955 98.9125L86.3133 99.709L86.3168 99.7001L84.2955 98.9125ZM68.4508 122.011L69.8365 123.68L69.8457 123.673L69.8548 123.665L68.4508 122.011ZM57.7604 114.757L55.8906 113.657L55.8785 113.678L55.8667 113.699L57.7604 114.757ZM63.4874 97.0035L65.6262 97.3661L63.4874 97.0035ZM62.9147 39.7337L60.7781 40.109L60.779 40.114L62.9147 39.7337ZM55.2787 17.5894L53.4342 18.7312L53.444 18.7469L53.454 18.7624L55.2787 17.5894ZM32.7526 15.8713L30.9224 14.7066L30.9097 14.7266L30.8974 14.7469L32.7526 15.8713ZM26.8347 33.434L24.7021 33.0364L24.6994 33.0509L24.6969 33.0654L26.8347 33.434ZM27.4074 91.2766L25.2708 91.6519L25.2717 91.6569L27.4074 91.2766ZM35.0434 113.23L33.2186 114.403L33.2284 114.418L33.2384 114.433L35.0434 113.23ZM45.1611 128.242C36.1707 128.242 28.5693 125.761 22.2442 120.868L19.5895 124.3C26.7546 129.843 35.316 132.58 45.1611 132.58V128.242ZM22.2442 120.868C15.8826 115.947 10.9418 108.869 7.48953 99.4989L3.41841 100.999C7.09306 110.973 12.4608 118.785 19.5895 124.3L22.2442 120.868ZM7.50108 99.531C4.1652 90.0176 2.469 78.6902 2.469 65.5051H-1.86963C-1.86963 79.046 -0.129643 90.8811 3.40686 100.967L7.50108 99.531ZM2.469 65.5051C2.469 53.2526 4.34438 42.4586 8.04446 33.0851L4.00887 31.4921C0.0729709 41.4631 -1.86963 52.8134 -1.86963 65.5051H2.469ZM8.04798 33.0761C11.7626 23.542 16.7926 16.1673 23.0817 10.8458L20.2792 7.53376C13.3326 13.4117 7.92674 21.4362 4.00535 31.5011L8.04798 33.0761ZM23.0845 10.8434C29.4346 5.45183 36.7629 2.76861 45.1611 2.76861V-1.57001C35.7419 -1.57001 27.4165 1.47376 20.2764 7.53613L23.0845 10.8434ZM45.1611 2.76861C54.1514 2.76861 61.7528 5.24897 68.0779 10.142L70.7326 6.71035C63.5676 1.16756 55.0062 -1.57001 45.1611 -1.57001V2.76861ZM68.0779 10.142C74.426 15.0528 79.3021 22.1791 82.6301 31.6701L86.7244 30.2345C83.18 20.1265 77.8748 12.2354 70.7326 6.71035L68.0779 10.142ZM82.6417 31.7023C86.0948 41.075 87.8531 52.3261 87.8531 65.5051H92.1917C92.1917 51.9582 90.3866 40.1741 86.7128 30.2024L82.6417 31.7023ZM87.8531 65.5051C87.8531 77.7568 85.978 88.6185 82.2741 98.125L86.3168 99.7001C90.2489 89.6076 92.1917 78.1976 92.1917 65.5051H87.8531ZM82.2777 98.116C78.5677 107.515 73.4759 114.899 67.0468 120.358L69.8548 123.665C76.9159 117.67 82.3872 109.655 86.3133 99.709L82.2777 98.116ZM67.0651 120.342C60.7101 125.618 53.4373 128.242 45.1611 128.242V132.58C54.4476 132.58 62.7012 129.604 69.8365 123.68L67.0651 120.342ZM48.5973 123.417C53.3399 123.417 57.0029 120.56 59.6541 115.815L55.8667 113.699C53.6818 117.609 51.236 119.078 48.5973 119.078V123.417ZM59.6302 115.857C62.3598 111.217 64.3299 105.014 65.6262 97.3661L61.3486 96.641C60.0996 104.01 58.2517 109.644 55.8906 113.657L59.6302 115.857ZM65.6262 97.3661C66.9235 89.712 67.5657 81.0605 67.5657 71.423H63.2271C63.2271 80.8755 62.5966 89.2776 61.3486 96.641L65.6262 97.3661ZM67.5657 71.423C67.5657 59.4903 66.732 48.7962 65.0504 39.3534L60.779 40.114C62.4063 49.252 63.2271 59.6842 63.2271 71.423H67.5657ZM65.0513 39.3583C63.3697 29.7864 60.7538 22.0945 57.1035 16.4163L53.454 18.7624C56.676 23.7746 59.1508 30.8456 60.7781 40.109L65.0513 39.3583ZM57.1232 16.4475C53.5005 10.5955 48.5371 7.40226 42.2976 7.40226V11.7409C46.7484 11.7409 50.4391 13.8929 53.4342 18.7312L57.1232 16.4475ZM42.2976 7.40226C37.6169 7.40226 33.8386 10.124 30.9224 14.7066L34.5828 17.0359C37.0118 13.2189 39.5968 11.7409 42.2976 11.7409V7.40226ZM30.8974 14.7469C28.1628 19.2589 26.1263 25.3975 24.7021 33.0364L28.9673 33.8316C30.3429 26.4531 32.2517 20.8831 34.6078 16.9956L30.8974 14.7469ZM24.6969 33.0654C23.398 40.5991 22.7564 49.3178 22.7564 59.2054H27.095C27.095 49.4941 27.7261 41.0318 28.9725 33.8026L24.6969 33.0654ZM22.7564 59.2054C22.7564 71.2645 23.59 82.084 25.2708 91.6519L29.544 90.9012C27.9159 81.6337 27.095 71.0724 27.095 59.2054H22.7564ZM25.2717 91.6569C26.9543 101.105 29.5712 108.729 33.2186 114.403L36.8682 112.057C33.6432 107.04 31.1695 100.029 29.5431 90.8962L25.2717 91.6569ZM33.2384 114.433C37.1233 120.261 42.2648 123.417 48.5973 123.417V119.078C43.9848 119.078 40.0904 116.89 36.8484 112.027L33.2384 114.433ZM119.637 127.929L118.887 129.965L118.919 129.977L118.951 129.987L119.637 127.929ZM108.756 120.293L110.507 119.013L110.446 118.93L110.377 118.852L108.756 120.293ZM110.665 111.321L109.333 109.609L110.665 111.321ZM119.255 104.64V102.47H118.511L117.924 102.927L119.255 104.64ZM121.546 104.64L123.468 103.633L122.859 102.47H121.546V104.64ZM123.646 108.648L125.574 107.653L125.568 107.642L123.646 108.648ZM160.49 113.994L158.877 112.542L158.875 112.545L160.49 113.994ZM163.926 78.8681L161.997 79.8602L162.003 79.8717L162.009 79.8831L163.926 78.8681ZM152.472 68.3686L151.521 70.3183L151.53 70.3228L151.539 70.3272L152.472 68.3686ZM122.692 65.1233L122.88 67.2845L122.926 67.2804L122.972 67.2744L122.692 65.1233ZM113.147 66.2687H110.977V68.7831L113.465 68.4146L113.147 66.2687ZM113.147 2.50829V0.338982H110.977V2.50829H113.147ZM178.243 2.50829H180.413V0.338982H178.243V2.50829ZM178.243 19.8801V22.0495H180.413V19.8801H178.243ZM122.883 19.8801V17.7108H120.713V19.8801H122.883ZM122.883 45.8425H120.713V48.1516L123.018 48.0076L122.883 45.8425ZM129.182 45.4607L129.055 43.2951L129.182 45.4607ZM166.026 50.8059L165.069 52.7527L165.075 52.7559L165.082 52.759L166.026 50.8059ZM182.634 65.3142L180.753 66.3948L180.762 66.4097L180.77 66.4245L182.634 65.3142ZM181.489 108.648L179.653 107.493L181.489 108.648ZM163.544 124.684L162.574 122.744L163.544 124.684ZM137.391 128.242C130.683 128.242 125.008 127.433 120.323 125.871L118.951 129.987C124.193 131.734 130.354 132.58 137.391 132.58V128.242ZM120.387 125.894C115.849 124.222 112.615 121.898 110.507 119.013L107.004 121.573C109.733 125.306 113.753 128.073 118.887 129.965L120.387 125.894ZM110.377 118.852C109.676 118.063 109.398 117.292 109.398 116.475H105.059C105.059 118.458 105.8 120.233 107.135 121.734L110.377 118.852ZM109.398 116.475C109.398 115.859 109.851 114.702 111.997 113.033L109.333 109.609C106.897 111.503 105.059 113.782 105.059 116.475H109.398ZM111.997 113.033L120.587 106.352L117.924 102.927L109.333 109.609L111.997 113.033ZM119.255 106.809H121.546V102.47H119.255V106.809ZM119.625 105.646L121.724 109.655L125.568 107.642L123.468 103.633L119.625 105.646ZM121.718 109.643C123.88 113.832 126.625 117.221 129.98 119.738L132.584 116.267C129.831 114.202 127.484 111.355 125.574 107.653L121.718 109.643ZM129.98 119.738C133.518 122.391 138.095 123.608 143.5 123.608V119.269C138.723 119.269 135.155 118.195 132.584 116.267L129.98 119.738ZM143.5 123.608C150.967 123.608 157.224 120.88 162.104 115.442L158.875 112.545C154.846 117.034 149.777 119.269 143.5 119.269V123.608ZM162.102 115.445C167.114 109.877 169.531 102.64 169.531 93.9492H165.193C165.193 101.803 163.029 107.929 158.877 112.542L162.102 115.445ZM169.531 93.9492C169.531 87.9285 168.325 82.542 165.843 77.8531L162.009 79.8831C164.108 83.8483 165.193 88.5158 165.193 93.9492H169.531ZM165.855 77.876C163.309 72.9258 159.098 69.1212 153.405 66.41L151.539 70.3272C156.536 72.7067 159.961 75.9017 161.997 79.8602L165.855 77.876ZM153.423 66.4189C147.796 63.6741 140.43 62.3813 131.473 62.3813V66.7199C140.079 66.7199 146.712 67.9725 151.521 70.3183L153.423 66.4189ZM131.473 62.3813C128.451 62.3813 125.43 62.5784 122.411 62.9722L122.972 67.2744C125.807 66.9046 128.64 66.7199 131.473 66.7199V62.3813ZM122.504 62.9622C119.526 63.2211 116.301 63.6085 112.829 64.1228L113.465 68.4146C116.865 67.9108 120.003 67.5346 122.88 67.2845L122.504 62.9622ZM115.316 66.2687V2.50829H110.977V66.2687H115.316ZM113.147 4.67761H178.243V0.338982H113.147V4.67761ZM176.074 2.50829V19.8801H180.413V2.50829H176.074ZM178.243 17.7108H122.883V22.0495H178.243V17.7108ZM120.713 19.8801V45.8425H125.052V19.8801H120.713ZM123.018 48.0076C125.051 47.8805 127.149 47.7534 129.31 47.6262L129.055 43.2951C126.889 43.4225 124.786 43.5499 122.747 43.6774L123.018 48.0076ZM129.31 47.6262C131.424 47.5019 133.736 47.4391 136.245 47.4391V43.1005C133.665 43.1005 131.267 43.165 129.055 43.2951L129.31 47.6262ZM136.245 47.4391C148.404 47.4391 157.965 49.2612 165.069 52.7527L166.983 48.859C159.069 44.9691 148.777 43.1005 136.245 43.1005V47.4391ZM165.082 52.759C172.416 56.3038 177.58 60.8709 180.753 66.3948L184.515 64.2336C180.816 57.7945 174.908 52.6894 166.97 48.8527L165.082 52.759ZM180.77 66.4245C184.129 72.062 185.81 78.2311 185.81 84.9769H190.149C190.149 77.4688 188.266 70.5295 184.498 64.204L180.77 66.4245ZM185.81 84.9769C185.81 93.5176 183.741 101 179.653 107.493L183.324 109.804C187.89 102.553 190.149 94.2534 190.149 84.9769H185.81ZM179.653 107.493C175.548 114.012 169.874 119.094 162.574 122.744L164.514 126.624C172.486 122.638 178.775 117.03 183.324 109.804L179.653 107.493ZM162.574 122.744C155.281 126.39 146.904 128.242 137.391 128.242V132.58C147.477 132.58 156.535 130.614 164.514 126.624L162.574 122.744Z" fill="url(#paint0_linear_806_8114)" />
                                <defs>
                                    <linearGradient id="paint0_linear_806_8114" x1="96.5" y1="-5.49805" x2="96.5" y2="128.999" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="white" />
                                        <stop offset="1" stop-color="white" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg style={{ position: "absolute", bottom: -20, left: -100 }} width="400" height="53" viewBox="0 0 456 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.794 13.39V24.94H25.304V32.266H9.794V44.476H27.284V52H0.554V5.866H27.284V13.39H9.794ZM55.877 52L48.353 40.648L41.687 52H31.787L43.733 33.652L31.655 15.436H42.083L49.541 26.722L56.273 15.436H66.173L54.161 33.652L66.305 52H55.877ZM76.0095 11.08C74.3815 11.08 73.0175 10.574 71.9175 9.562C70.8615 8.506 70.3335 7.208 70.3335 5.668C70.3335 4.128 70.8615 2.852 71.9175 1.84C73.0175 0.783997 74.3815 0.255997 76.0095 0.255997C77.6375 0.255997 78.9795 0.783997 80.0355 1.84C81.1355 2.852 81.6855 4.128 81.6855 5.668C81.6855 7.208 81.1355 8.506 80.0355 9.562C78.9795 10.574 77.6375 11.08 76.0095 11.08ZM80.5635 15.436V52H71.3235V15.436H80.5635ZM100.451 23.026V40.714C100.451 41.946 100.737 42.848 101.309 43.42C101.925 43.948 102.937 44.212 104.345 44.212H108.635V52H102.827C95.0387 52 91.1447 48.216 91.1447 40.648V23.026H86.7887V15.436H91.1447V6.394H100.451V15.436H108.635V23.026H100.451ZM146.913 52.462C143.701 52.462 140.797 51.912 138.201 50.812C135.649 49.712 133.625 48.128 132.129 46.06C130.633 43.992 129.863 41.55 129.819 38.734H139.719C139.851 40.626 140.511 42.122 141.699 43.222C142.931 44.322 144.603 44.872 146.715 44.872C148.871 44.872 150.565 44.366 151.797 43.354C153.029 42.298 153.645 40.934 153.645 39.262C153.645 37.898 153.227 36.776 152.391 35.896C151.555 35.016 150.499 34.334 149.223 33.85C147.991 33.322 146.275 32.75 144.075 32.134C141.083 31.254 138.641 30.396 136.749 29.56C134.901 28.68 133.295 27.382 131.931 25.666C130.611 23.906 129.951 21.574 129.951 18.67C129.951 15.942 130.633 13.566 131.997 11.542C133.361 9.518 135.275 7.978 137.739 6.922C140.203 5.822 143.019 5.272 146.187 5.272C150.939 5.272 154.789 6.438 157.737 8.77C160.729 11.058 162.379 14.27 162.687 18.406H152.523C152.435 16.822 151.753 15.524 150.477 14.512C149.245 13.456 147.595 12.928 145.527 12.928C143.723 12.928 142.271 13.39 141.171 14.314C140.115 15.238 139.587 16.58 139.587 18.34C139.587 19.572 139.983 20.606 140.775 21.442C141.611 22.234 142.623 22.894 143.811 23.422C145.043 23.906 146.759 24.478 148.959 25.138C151.951 26.018 154.393 26.898 156.285 27.778C158.177 28.658 159.805 29.978 161.169 31.738C162.533 33.498 163.215 35.808 163.215 38.668C163.215 41.132 162.577 43.42 161.301 45.532C160.025 47.644 158.155 49.338 155.691 50.614C153.227 51.846 150.301 52.462 146.913 52.462ZM168.85 33.718C168.85 29.934 169.62 26.634 171.16 23.818C172.7 20.958 174.834 18.758 177.562 17.218C180.29 15.634 183.414 14.842 186.934 14.842C191.466 14.842 195.206 15.986 198.154 18.274C201.146 20.518 203.148 23.686 204.16 27.778H194.194C193.666 26.194 192.764 24.962 191.488 24.082C190.256 23.158 188.716 22.696 186.868 22.696C184.228 22.696 182.138 23.664 180.598 25.6C179.058 27.492 178.288 30.198 178.288 33.718C178.288 37.194 179.058 39.9 180.598 41.836C182.138 43.728 184.228 44.674 186.868 44.674C190.608 44.674 193.05 43.002 194.194 39.658H204.16C203.148 43.618 201.146 46.764 198.154 49.096C195.162 51.428 191.422 52.594 186.934 52.594C183.414 52.594 180.29 51.824 177.562 50.284C174.834 48.7 172.7 46.5 171.16 43.684C169.62 40.824 168.85 37.502 168.85 33.718ZM244.919 32.926C244.919 34.246 244.831 35.434 244.655 36.49H217.925C218.145 39.13 219.069 41.198 220.697 42.694C222.325 44.19 224.327 44.938 226.703 44.938C230.135 44.938 232.577 43.464 234.029 40.516H243.995C242.939 44.036 240.915 46.94 237.923 49.228C234.931 51.472 231.257 52.594 226.901 52.594C223.381 52.594 220.213 51.824 217.397 50.284C214.625 48.7 212.447 46.478 210.863 43.618C209.323 40.758 208.553 37.458 208.553 33.718C208.553 29.934 209.323 26.612 210.863 23.752C212.403 20.892 214.559 18.692 217.331 17.152C220.103 15.612 223.293 14.842 226.901 14.842C230.377 14.842 233.479 15.59 236.207 17.086C238.979 18.582 241.113 20.716 242.609 23.488C244.149 26.216 244.919 29.362 244.919 32.926ZM235.349 30.286C235.305 27.91 234.447 26.018 232.775 24.61C231.103 23.158 229.057 22.432 226.637 22.432C224.349 22.432 222.413 23.136 220.829 24.544C219.289 25.908 218.343 27.822 217.991 30.286H235.349ZM271.925 14.908C276.281 14.908 279.801 16.294 282.485 19.066C285.169 21.794 286.511 25.622 286.511 30.55V52H277.271V31.804C277.271 28.9 276.545 26.678 275.093 25.138C273.641 23.554 271.661 22.762 269.153 22.762C266.601 22.762 264.577 23.554 263.081 25.138C261.629 26.678 260.903 28.9 260.903 31.804V52H251.663V15.436H260.903V19.99C262.135 18.406 263.697 17.174 265.589 16.294C267.525 15.37 269.637 14.908 271.925 14.908ZM292.922 33.586C292.922 29.89 293.648 26.612 295.1 23.752C296.596 20.892 298.598 18.692 301.106 17.152C303.658 15.612 306.496 14.842 309.62 14.842C312.348 14.842 314.724 15.392 316.748 16.492C318.816 17.592 320.466 18.978 321.698 20.65V15.436H331.004V52H321.698V46.654C320.51 48.37 318.86 49.8 316.748 50.944C314.68 52.044 312.282 52.594 309.554 52.594C306.474 52.594 303.658 51.802 301.106 50.218C298.598 48.634 296.596 46.412 295.1 43.552C293.648 40.648 292.922 37.326 292.922 33.586ZM321.698 33.718C321.698 31.474 321.258 29.56 320.378 27.976C319.498 26.348 318.31 25.116 316.814 24.28C315.318 23.4 313.712 22.96 311.996 22.96C310.28 22.96 308.696 23.378 307.244 24.214C305.792 25.05 304.604 26.282 303.68 27.91C302.8 29.494 302.36 31.386 302.36 33.586C302.36 35.786 302.8 37.722 303.68 39.394C304.604 41.022 305.792 42.276 307.244 43.156C308.74 44.036 310.324 44.476 311.996 44.476C313.712 44.476 315.318 44.058 316.814 43.222C318.31 42.342 319.498 41.11 320.378 39.526C321.258 37.898 321.698 35.962 321.698 33.718ZM349.269 21.112C350.457 19.176 351.997 17.658 353.889 16.558C355.825 15.458 358.025 14.908 360.489 14.908V24.61H358.047C355.143 24.61 352.943 25.292 351.447 26.656C349.995 28.02 349.269 30.396 349.269 33.784V52H340.029V15.436H349.269V21.112ZM371.398 11.08C369.77 11.08 368.406 10.574 367.306 9.562C366.25 8.506 365.722 7.208 365.722 5.668C365.722 4.128 366.25 2.852 367.306 1.84C368.406 0.783997 369.77 0.255997 371.398 0.255997C373.026 0.255997 374.368 0.783997 375.424 1.84C376.524 2.852 377.074 4.128 377.074 5.668C377.074 7.208 376.524 8.506 375.424 9.562C374.368 10.574 373.026 11.08 371.398 11.08ZM375.952 15.436V52H366.712V15.436H375.952ZM401.317 52.594C397.797 52.594 394.629 51.824 391.813 50.284C388.997 48.7 386.775 46.478 385.147 43.618C383.563 40.758 382.771 37.458 382.771 33.718C382.771 29.978 383.585 26.678 385.213 23.818C386.885 20.958 389.151 18.758 392.011 17.218C394.871 15.634 398.061 14.842 401.581 14.842C405.101 14.842 408.291 15.634 411.151 17.218C414.011 18.758 416.255 20.958 417.883 23.818C419.555 26.678 420.391 29.978 420.391 33.718C420.391 37.458 419.533 40.758 417.817 43.618C416.145 46.478 413.857 48.7 410.953 50.284C408.093 51.824 404.881 52.594 401.317 52.594ZM401.317 44.542C402.989 44.542 404.551 44.146 406.003 43.354C407.499 42.518 408.687 41.286 409.567 39.658C410.447 38.03 410.887 36.05 410.887 33.718C410.887 30.242 409.963 27.58 408.115 25.732C406.311 23.84 404.089 22.894 401.449 22.894C398.809 22.894 396.587 23.84 394.783 25.732C393.023 27.58 392.143 30.242 392.143 33.718C392.143 37.194 393.001 39.878 394.717 41.77C396.477 43.618 398.677 44.542 401.317 44.542ZM441.161 52.594C438.169 52.594 435.485 52.066 433.109 51.01C430.733 49.91 428.841 48.436 427.433 46.588C426.069 44.74 425.321 42.694 425.189 40.45H434.495C434.671 41.858 435.353 43.024 436.541 43.948C437.773 44.872 439.291 45.334 441.095 45.334C442.855 45.334 444.219 44.982 445.187 44.278C446.199 43.574 446.705 42.672 446.705 41.572C446.705 40.384 446.089 39.504 444.857 38.932C443.669 38.316 441.755 37.656 439.115 36.952C436.387 36.292 434.143 35.61 432.383 34.906C430.667 34.202 429.171 33.124 427.895 31.672C426.663 30.22 426.047 28.262 426.047 25.798C426.047 23.774 426.619 21.926 427.763 20.254C428.951 18.582 430.623 17.262 432.779 16.294C434.979 15.326 437.553 14.842 440.501 14.842C444.857 14.842 448.333 15.942 450.929 18.142C453.525 20.298 454.955 23.224 455.219 26.92H446.375C446.243 25.468 445.627 24.324 444.527 23.488C443.471 22.608 442.041 22.168 440.237 22.168C438.565 22.168 437.267 22.476 436.343 23.092C435.463 23.708 435.023 24.566 435.023 25.666C435.023 26.898 435.639 27.844 436.871 28.504C438.103 29.12 440.017 29.758 442.613 30.418C445.253 31.078 447.431 31.76 449.147 32.464C450.863 33.168 452.337 34.268 453.569 35.764C454.845 37.216 455.505 39.152 455.549 41.572C455.549 43.684 454.955 45.576 453.767 47.248C452.623 48.92 450.951 50.24 448.751 51.208C446.595 52.132 444.065 52.594 441.161 52.594Z" fill="white" />
                            </svg>
                        </Box>
                    </Box>
                </Box>
                <ExitScenariosComp refiScenario={refiScenario} refiScenarioData={refiScenarioData}
                    saleScenario={saleScenario} saleScenarioData={saleScenarioData} />
            </Page>
        </Document>

    return (
        <Box>
            <Head>
                <title>Exit Scenarios</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LogiCLoseWebLayout title={'Exit Scenarios'} queryToken={router.query.token}
                sharedUrl={sharedUrl} randomPass={randomPass}
                editUrl={'/exitScenarios/refinanceScenario'}>
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
                <ExitScenariosComp refiScenario={refiScenario} refiScenarioData={refiScenarioData}
                    saleScenario={saleScenario} saleScenarioData={saleScenarioData} />
            </LogiCLoseWebLayout>
        </Box>
    )
}

export default ExitScenarios
// export default IsAuthHOC(ExitScenarios, '/webView/exitScenarios')


//saleScenario unused
{/* <Box className='flex flex-col w-4/6 mt-6 bg-[#f8fafc]
                       px-4 pb-8 pt-2 rounded-xl'>
                            <Box className='flex flex-row justify-between mt-5'>
                                {saleScenario && saleScenario.year && saleScenario.year.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.year ?
                                                saleScenario.year.subtitle :
                                                'Year'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.year.text ?
                                                saleScenario.year.text :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.exitCapRate && saleScenario.exitCapRate.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.exitCapRate ?
                                                saleScenario.exitCapRate.subtitle :
                                                'Exit Cap Rate'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.exitCapRate.text ?
                                                saleScenario.exitCapRate.text :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.noi && saleScenario.noi.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.noi ?
                                                saleScenario.noi.subtitle :
                                                'NOI'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.noi.text ?
                                                saleScenario.noi.text :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {saleScenario && saleScenario.salePrice && saleScenario.salePrice.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.salePrice ?
                                                saleScenario.salePrice.subtitle :
                                                'Sale Price'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.salePrice.text ?
                                                `$${saleScenario.salePrice.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.sellingCosts && saleScenario.sellingCosts.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.sellingCosts ?
                                                saleScenario.sellingCosts.subtitle :
                                                'Selling Costs'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.sellingCosts.text ?
                                                `$${saleScenario.sellingCosts.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.debtRepayment && saleScenario.debtRepayment.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.debtRepayment ?
                                                saleScenario.debtRepayment.subtitle :
                                                'Debt Repayment'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.debtRepayment.text ?
                                                `$${saleScenario.debtRepayment.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {saleScenario && saleScenario.transferTax && saleScenario.transferTax.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.transferTax ?
                                                saleScenario.transferTax.subtitle :
                                                'Transfer Tax'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.transferTax.text ?
                                                `$${saleScenario.transferTax.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.saleProceeds && saleScenario.saleProceeds.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.saleProceeds ?
                                                saleScenario.saleProceeds.subtitle :
                                                'Sale Proceeds'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.saleProceeds.text ?
                                                `$${saleScenario.saleProceeds.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {saleScenario && saleScenario.other && saleScenario.other.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.other ?
                                                saleScenario.other.subtitle :
                                                'Other'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {saleScenario && saleScenario.other.text ?
                                                `${saleScenario.other.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                        </Box> */}


//refiScenario unused
{/* <Box className='flex flex-col w-4/6 mt-6 bg-[#ECF6FF]
                       px-4 pb-8 pt-2 rounded-xl'>
                            <Box className='flex flex-row justify-between mt-5'>
                                {refiScenario && refiScenario.year && refiScenario.year.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.year ?
                                                refiScenario.year.subtitle :
                                                'Year'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.year.text ?
                                                `${refiScenario.year.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.noi && refiScenario.noi.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.noi ?
                                                refiScenario.noi.subtitle :
                                                'NOI'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.noi.text ?
                                                `${refiScenario.noi.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.interestRate && refiScenario.interestRate.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.interestRate ?
                                                refiScenario.interestRate.subtitle :
                                                'Interest Rate'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.interestRate.text ?
                                                `${refiScenario.interestRate.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {refiScenario && refiScenario.constant && refiScenario.constant.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.constant ?
                                                refiScenario.constant.subtitle :
                                                'Constant'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.constant.text ?
                                                `${refiScenario.constant.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.annualDebtService && refiScenario.annualDebtService.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.annualDebtService ?
                                                refiScenario.annualDebtService.subtitle :
                                                'Annual Debt Service'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.annualDebtService.text ?
                                                `${refiScenario.annualDebtService.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.amortPeriod && refiScenario.amortPeriod.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.amortPeriod ?
                                                refiScenario.amortPeriod.subtitle :
                                                'Amort Period'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.amortPeriod.text ?
                                                `${refiScenario.amortPeriod.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {refiScenario && refiScenario.dscr && refiScenario.dscr.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.dscr ?
                                                refiScenario.dscr.subtitle :
                                                'DSCR'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.dscr.text ?
                                                `${refiScenario.dscr.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.loanAmount && refiScenario.loanAmount.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.loanAmount ?
                                                refiScenario.loanAmount.subtitle :
                                                'Loan Amount'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.loanAmount.text ?
                                                `$${refiScenario.loanAmount.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.debtRepayment && refiScenario.debtRepayment.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.debtRepayment ?
                                                refiScenario.debtRepayment.subtitle :
                                                'Debt Repayment'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.debtRepayment.text ?
                                                `$${refiScenario.debtRepayment.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>

                            <Box className='flex flex-row justify-between mt-5'>
                                {refiScenario && refiScenario.refiFees && refiScenario.refiFees.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.refiFees ?
                                                refiScenario.refiFees.subtitle :
                                                'Refi Fees'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.refiFees.text ?
                                                `$${refiScenario.refiFees.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.refiProceeds && refiScenario.refiProceeds.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.refiProceeds ?
                                                refiScenario.refiProceeds.subtitle :
                                                'Refi Proceeds'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.refiProceeds.text ?
                                                `$${refiScenario.refiProceeds.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                                {refiScenario && refiScenario.other && refiScenario.other.text &&
                                    <Box sx={{ width: 180 }}>
                                        <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.other ?
                                                refiScenario.other.subtitle :
                                                'Other'}
                                        </Typography>
                                        <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                            {refiScenario && refiScenario.other.text ?
                                                `${refiScenario.other.text}` :
                                                '(no data found)'}
                                        </Typography>
                                    </Box>
                                }
                            </Box>
                        </Box> */}