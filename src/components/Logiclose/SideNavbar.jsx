import React from 'react'
import { useRouter } from "next/router"
import { Box, Typography } from "@mui/material"
import Logo from '../Logo'
import PlaceIcon from '@mui/icons-material/Place'
import LogoutIcon from '@mui/icons-material/Logout'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'
import { logicloseState } from '../../features/logicloseSlice'
import { useSelector } from 'react-redux'

const SideNavbar = ({ queryToken, sharedUrl }) => {

    const route = useRouter()
    const state = useSelector(store => logicloseState(store))
    return (
        <Box className={`h-full flex flex-col justify-between bg-sky-50 shadow duration-500 w-[${state.isDrawerExpand ? '20%' : '5%'}] fixed`}>
            <Box
                className={`flex flex-col
              text-gray-700  h-full
             border-r-2 border-gray-100`}>

                {state.isDrawerExpand ?
                    <div className="duration-500 h-10 mt-7 flex w-[200] ml-auto mr-auto justify-center items-center relative cursor-pointer">
                        <Logo />
                    </div> :
                    <div className="h-10 duration-500 mt-7 flex w-[200] ml-auto mr-auto justify-center items-center relative cursor-pointer">
                        <svg className='mr-1 mt-2' width="40" height="40" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.37472 1.30713C5.60702 1.30974 4.87162 1.61636 4.32946 2.1599C3.78731 2.70344 3.48256 3.43962 3.48191 4.20733C3.48061 4.70322 3.60796 5.19097 3.85152 5.62293C2.39011 7.22885 1.50696 9.27688 1.34224 11.442C1.17751 13.607 1.74066 15.7651 2.94228 17.5736C2.46032 18.1682 2.23427 18.9298 2.31387 19.691C2.39346 20.4522 2.77219 21.1506 3.36672 21.6325C3.96125 22.1145 4.72288 22.3406 5.48408 22.261C6.24528 22.1814 6.94368 21.8026 7.42564 21.2081C9.50009 22.031 11.7953 22.1111 13.9221 21.4347C16.0488 20.7584 17.8761 19.3672 19.0942 17.4972C19.3408 17.5666 19.5957 17.6023 19.8519 17.6032C20.548 17.6048 21.2214 17.3554 21.7485 16.9006C22.2755 16.4458 22.6209 15.8162 22.7213 15.1273C22.8216 14.4385 22.6702 13.7365 22.2947 13.1503C21.9193 12.564 21.345 12.1329 20.6774 11.9359C20.645 10.4998 20.2936 9.08896 19.6486 7.80552C19.0036 6.52207 18.0812 5.39819 16.9482 4.51531C15.8151 3.63242 14.4999 3.01265 13.0977 2.70091C11.6956 2.38916 10.2416 2.39325 8.84124 2.71287C8.58625 2.28574 8.22511 1.93183 7.79292 1.68551C7.36073 1.43919 6.87217 1.30884 6.37472 1.30713ZM6.37472 2.27674C7.55131 2.34573 8.28929 3.15394 8.29792 4.20733C8.29759 4.45945 8.24757 4.70903 8.15072 4.9418C8.05386 5.17457 7.91207 5.38597 7.73345 5.5639C7.55484 5.74183 7.3429 5.88281 7.10975 5.97877C6.87661 6.07472 6.62684 6.12378 6.37472 6.12313C6.12146 6.12796 5.86982 6.08176 5.63479 5.98728C5.39976 5.8928 5.18616 5.75199 5.0067 5.57322C4.82724 5.39445 4.6856 5.18139 4.59022 4.94672C4.49484 4.71206 4.44767 4.4606 4.45152 4.20733C4.4494 3.95383 4.49764 3.70243 4.59344 3.46773C4.68925 3.23302 4.83071 3.01968 5.00962 2.84008C5.18853 2.66048 5.40133 2.5182 5.63567 2.4215C5.87 2.32479 6.12121 2.27559 6.37472 2.27674ZM10.9936 3.44347C13.2466 3.44308 15.4123 4.31547 17.0359 5.87753C18.6595 7.4396 19.6149 9.56989 19.7016 11.8213C19.0999 11.855 18.5237 12.0757 18.0535 12.4526C17.5833 12.8296 17.2424 13.3439 17.0786 13.9238C16.9147 14.5038 16.9359 15.1204 17.1394 15.6877C17.3428 16.2549 17.7182 16.7446 18.2133 17.0882C17.1159 18.7112 15.5034 19.9169 13.6363 20.5104C11.7692 21.1039 9.75649 21.0507 7.92338 20.3592C8.04323 20.0393 8.10457 19.7005 8.10449 19.3588C8.10701 18.8405 7.96982 18.3312 7.70736 17.8842C7.44489 17.4373 7.06684 17.0694 6.61297 16.8191C6.1591 16.5689 5.64618 16.4455 5.12815 16.4621C4.61013 16.4787 4.10613 16.6345 3.66918 16.9133C2.76556 15.4979 2.28747 13.8528 2.29177 12.1736C2.28316 10.0399 3.0623 7.97796 4.47985 6.38309C4.89796 6.74762 5.41206 6.98425 5.96089 7.06479C6.50972 7.14532 7.07013 7.06637 7.57534 6.83733C8.08055 6.60829 8.50925 6.23882 8.81037 5.77296C9.11148 5.3071 9.27231 4.76449 9.27368 4.20979C9.27334 4.01393 9.2527 3.81864 9.21208 3.62704C9.798 3.50457 10.395 3.44305 10.9936 3.44347ZM19.8531 12.7798C20.994 12.7638 21.7468 13.6964 21.7689 14.703C21.771 14.9559 21.7231 15.2068 21.6277 15.4411C21.5324 15.6753 21.3916 15.8884 21.2135 16.068C21.0354 16.2476 20.8235 16.3902 20.59 16.4875C20.3565 16.5847 20.1061 16.6348 19.8531 16.6348C18.8022 16.6016 17.9509 15.6492 17.9299 14.703C17.9289 14.4501 17.978 14.1995 18.0743 13.9657C18.1706 13.7318 18.3122 13.5194 18.491 13.3405C18.6697 13.1616 18.8821 13.0199 19.1159 12.9234C19.3497 12.827 19.6002 12.7777 19.8531 12.7786V12.7798ZM5.21538 17.4282C5.46821 17.4282 5.71855 17.4783 5.95195 17.5755C6.18536 17.6727 6.39722 17.8151 6.57531 17.9946C6.7534 18.1741 6.89421 18.387 6.98962 18.6211C7.08502 18.8553 7.13313 19.106 7.13118 19.3588C7.07451 20.4196 6.28108 21.2537 5.21538 21.2746C4.96326 21.2753 4.71349 21.2262 4.48034 21.1303C4.2472 21.0343 4.03526 20.8933 3.85664 20.7154C3.67802 20.5375 3.53623 20.3261 3.43938 20.0933C3.34252 19.8605 3.2925 19.611 3.29218 19.3588C3.31189 18.2488 4.05604 17.4443 5.21538 17.4282Z" fill="#F27A30" stroke="#F27A30" strokeMiterlimit="10" />
                        </svg>
                    </div>
                }

                <Box className="mt-4">
                    <Box
                        className={`h-10 px-4 my-6 flex flex-row items-center w-[80%] hover:bg-[#D8EEFD] hover:rounded-r-2xl
                            focus:text-orange-500 cursor-pointer ${route.pathname === '/webView/executiveSummary' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/executiveSummary')
                            } else {
                                console.log('sharedUrl', sharedUrl);
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/executiveSummary?${restUrl}`)
                            }
                        }}>
                        {/* <svg className='ionicon' width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.2172 0.925781H0V19.334H14.4V5.13338L10.2172 0.925781ZM7.5739 17.0124H2.59928C2.38334 17.0124 2.19539 16.8508 2.19539 16.6329C2.19539 16.43 2.36734 16.2535 2.59928 16.2535H7.5739C7.78984 16.2535 7.97779 16.415 7.97779 16.6329C7.97779 16.8358 7.80983 17.0124 7.5739 17.0124ZM11.8047 14.6155H2.59928C2.38334 14.6155 2.19539 14.454 2.19539 14.2361C2.19539 14.0332 2.36734 13.8566 2.59928 13.8566H11.8047C12.0207 13.8566 12.2086 14.0182 12.2086 14.2361C12.2086 14.454 12.0247 14.6155 11.8047 14.6155ZM11.8047 12.2337H2.59928C2.38334 12.2337 2.19539 12.0722 2.19539 11.8543C2.19539 11.6514 2.36734 11.4748 2.59928 11.4748H11.8047C12.0207 11.4748 12.2086 11.6364 12.2086 11.8543C12.2086 12.0722 12.0247 12.2337 11.8047 12.2337ZM11.8047 9.85191H2.59928C2.38334 9.85191 2.19539 9.69037 2.19539 9.47248C2.19539 9.25458 2.36734 9.09304 2.59928 9.09304H11.8047C12.0207 9.09304 12.2086 9.25458 12.2086 9.47248C12.2086 9.69037 12.0247 9.85191 11.8047 9.85191ZM11.8047 7.45508H2.59928C2.38334 7.45508 2.19539 7.29354 2.19539 7.07564C2.19539 6.87278 2.36734 6.69621 2.59928 6.69621H11.8047C12.0207 6.69621 12.2086 6.85775 12.2086 7.07564C12.2086 7.29729 12.0247 7.45508 11.8047 7.45508ZM9.40939 5.87723V1.66963L13.5922 5.87723H9.40939Z" fill="#469BD3" />
                            </svg> */}
                        <ArticleOutlinedIcon sx={{ color: route.pathname === '/webView/executiveSummary' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/executiveSummary' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Executive Summary
                            </Typography>
                        }
                    </Box>
                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%]
                            focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer 
                            ${route.pathname === '/webView/propertySummary' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/propertySummary')
                            } else {
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/propertySummary?${restUrl}`)
                            }
                        }}>
                        {/* <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 8.45153L17.9444 9.82147L9.50001 2.40274L1.05556 9.82147L0 8.45153L9.50001 0.105469L19 8.45153ZM9.50001 4.11253L15.6308 9.51499L15.6299 14.6136V16.168V16.4684H8.74657V10.0858H8.74767V9.5223H5.08172V9.56595C5.08172 9.75033 5.08172 9.92134 5.08172 10.0858C5.08172 10.3913 5.08172 10.674 5.08172 10.9754V11.6472V12.9591V16.4683H3.37014V16.1469V14.6136V9.51589L9.50001 4.11253ZM10.474 13.1794H13.9086V9.51057H10.474V13.1794Z" fill="#BABABA" />
                            </svg> */}
                        <HomeOutlinedIcon sx={{ color: route.pathname === '/webView/propertySummary' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/propertySummary' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Property Description
                            </Typography>
                        }
                    </Box>

                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%]
                        focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer
                        ${route.pathname === '/webView/mapComperison' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/mapComperison')
                            } else {
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/mapComperison?${restUrl}`)
                            }
                        }}>
                        <TravelExploreOutlinedIcon sx={{ color: route.pathname === '/webView/mapComperison' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/mapComperison' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Comperison Map
                            </Typography>
                        }
                    </Box>

                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%]
                            focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer
                            ${route.pathname === '/webView/locationOverView' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/locationOverView')
                            } else {
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/locationOverView?${restUrl}`)
                            }
                        }
                        }>
                        <PlaceIcon sx={{ color: route.pathname === '/webView/locationOverView' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/locationOverView' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Location Overview
                            </Typography>
                        }
                    </Box>

                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%]
                            focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer
                            ${route.pathname === '/webView/financialSummary' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/financialSummary')
                            } else {
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/financialSummary?${restUrl}`)
                            }
                        }}>
                        <FeedOutlinedIcon sx={{ color: route.pathname === '/webView/financialSummary' ? "#0184FF" : "#bdbdbd" }} />
                        {/* <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.82412 6.77953C3.69419 6.89086 3.54319 6.93396 3.32899 6.9555V5.77038C3.58533 5.85657 3.7574 5.94636 3.86626 6.03255C3.95054 6.11874 4.01726 6.25161 4.01726 6.40604C3.99623 6.56046 3.93302 6.68975 3.82412 6.77953ZM2.9006 3.68026C2.70746 3.70181 2.55646 3.76645 2.4476 3.85623C2.33874 3.96756 2.27553 4.09685 2.27553 4.22973C2.27553 4.38415 2.31767 4.49189 2.40546 4.58167C2.48974 4.66786 2.66181 4.75764 2.9006 4.84383V3.68026ZM13 6.18697V13.4844C13 14.3859 12.2907 15.1113 11.4093 15.1113H1.59077C0.709348 15.1113 0 14.3859 0 13.4844V2.34072C0 1.4393 0.709348 0.713867 1.59077 0.713867H7.73611C8.35763 0.713867 8.65963 0.88984 9.04591 1.30643L12.3995 4.77919C12.849 5.21733 13 5.50463 13 6.18697ZM5.9311 4.56012H8.29439C8.57532 4.56012 8.7896 4.34106 8.7896 4.0753V3.70181C8.7896 3.43965 8.57532 3.21699 8.29439 3.21699H5.9311V4.56012ZM2.9006 5.65905V6.9555C2.51432 6.89086 2.14911 6.71489 1.78391 6.38449L1.30984 6.9555C1.78391 7.37209 2.32118 7.6163 2.9006 7.68094V8.16217H3.30795V7.67735C3.76095 7.6558 4.10158 7.52293 4.38251 7.28231C4.63886 7.0417 4.78986 6.7113 4.78986 6.33781C4.78986 5.94277 4.681 5.65546 4.44572 5.45794C4.21044 5.26042 3.84523 5.08445 3.35009 4.97312H3.32902V3.71976C3.67316 3.76286 3.97516 3.91729 4.25258 4.11481L4.681 3.5007C4.25258 3.2134 3.79958 3.03742 3.32551 3.01588V2.64238H2.91816V2.97278C2.51081 2.99433 2.16667 3.1272 1.90681 3.36782C1.65046 3.60844 1.49946 3.93883 1.49946 4.31233C1.49946 4.68582 1.62939 4.97312 1.8436 5.19219C2.06132 5.37175 2.40546 5.54772 2.9006 5.65905ZM11.7323 12.7806C11.7323 12.5184 11.5181 12.2957 11.2372 12.2957H1.71715C1.43622 12.2957 1.24308 12.5148 1.24308 12.7806V13.154C1.24308 13.4162 1.45729 13.6389 1.71715 13.6389H11.2372C11.4935 13.6389 11.7323 13.4198 11.7323 13.154V12.7806ZM11.7323 9.74593C11.7323 9.48373 11.5181 9.2611 11.2372 9.2611H1.71715C1.43622 9.2611 1.24308 9.48017 1.24308 9.74593V10.1194C1.24308 10.3815 1.45729 10.6042 1.71715 10.6042H11.2372C11.4935 10.6042 11.7323 10.3852 11.7323 10.1194V9.74593ZM11.7323 6.7113C11.7323 6.44913 11.5181 6.22648 11.2372 6.22648H5.9311V7.56602H11.2407C11.4971 7.56602 11.7358 7.34695 11.7358 7.0812V6.7113H11.7323Z" fill="#989898" />
                            </svg> */}
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/financialSummary' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Financial Summary
                            </Typography>
                        }
                    </Box>

                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%]
                        focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer
                        ${route.pathname === '/webView/exitScenarios' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => {
                            if (queryToken === undefined) {
                                route.push('/webView/exitScenarios')
                            } else {
                                const restUrl = sharedUrl?.split('?')[1]
                                route.push(`/webView/exitScenarios?${restUrl}`)
                            }
                        }}>
                        <LogoutIcon sx={{ color: route.pathname === '/webView/exitScenarios' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/exitScenarios' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                Exit Scenarios
                            </Typography>
                        }
                    </Box>

                    <Box
                        className={`h-10 px-4 my-6 flex items-center w-[80%] 
                            focus:text-orange-500 hover:bg-[#D8EEFD] hover:rounded-r-2xl cursor-pointer
                            ${route.pathname === '/webView/about' && 'bg-[#D8EEFD] rounded-r-2xl'}`}
                        onClick={() => route.push('/webView/about')}>
                        <InfoOutlinedIcon sx={{ color: route.pathname === '/webView/about' ? "#0184FF" : "#bdbdbd" }} />
                        {state.isDrawerExpand &&
                            <Typography variant='subtitle2' className='duration-500'
                                sx={{ fontFamily: "Poppins", color: route.pathname === '/webView/about' ? "#0184FF" : "#bdbdbd", textAlign: "left", ml: 2 }}>
                                About
                            </Typography>
                        }
                    </Box>
                </Box>
            </Box>
            {state.isDrawerExpand &&
                <Box>
                    <svg width="300" height="150" viewBox="0 0 259 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M302.961 181.373C297.44 172.374 289.157 166.145 279.492 161.992C277.421 123.922 261.544 87.9281 233.931 61.625C205.629 33.9375 167.662 18.0173 127.624 18.0173C117.96 18.0173 107.605 18.7095 97.9411 20.786C93.7991 15.2485 88.2768 10.4032 82.7545 6.94234C75.161 2.78915 66.8774 0.0205078 57.9033 0.0205078C44.0973 0.0205078 31.6717 5.55805 22.0074 14.5564C13.0336 24.247 7.51099 36.7063 7.51099 49.8578C7.51099 56.7796 8.89164 63.7016 11.6529 69.9311C-9.7465 94.8499 -22.172 125.306 -24.9332 157.839C-27.6945 190.371 -19.4108 222.904 -2.15317 250.592C-7.67561 258.898 -10.4368 268.588 -10.4368 278.279C-10.4368 288.661 -6.98528 298.353 -1.46284 306.659C4.74995 314.963 13.0336 321.194 22.6979 324.656C28.2202 326.731 33.7428 327.423 39.9554 327.423C44.0973 327.423 48.9294 326.731 53.0711 326.039C61.355 323.964 68.9482 319.117 75.161 313.58C106.915 324.656 141.43 325.348 173.184 315.658C204.938 305.273 232.551 285.201 251.879 257.513C254.639 258.205 257.402 258.205 260.162 258.205C260.162 258.205 260.162 258.205 260.854 258.205C272.587 258.205 284.323 254.052 293.298 246.438C302.271 238.824 308.484 227.749 309.865 215.982C311.936 203.523 309.173 191.063 302.961 181.373ZM87.5866 288.661C88.2768 285.201 88.967 281.048 88.967 277.587C88.967 264.435 83.4446 251.976 74.4708 242.285C64.8065 232.595 52.3809 227.749 39.2652 227.749C31.6717 227.749 24.7687 229.134 18.5559 232.595C6.1306 211.137 0.608004 185.526 1.98865 160.607C4.0595 135.689 13.7238 111.462 28.9107 92.081C35.1232 96.2343 42.0265 99.0029 49.6196 99.6952C59.2839 101.08 68.9482 99.6952 77.2319 95.542C86.206 91.389 93.1089 85.1592 98.6313 77.5453C103.463 68.5468 106.225 59.5483 106.225 49.8578C106.225 48.4734 106.225 47.7812 106.225 46.3969C113.128 45.0125 119.341 45.0125 126.934 45.0125C159.378 45.0125 190.442 57.4718 213.222 79.6216C235.312 100.387 248.427 128.767 251.19 158.531C242.906 159.915 235.312 163.376 229.099 168.914C227.719 170.298 226.338 170.99 224.957 172.374L224.267 173.067C218.744 178.604 214.603 186.218 212.532 193.832C209.771 204.215 209.771 214.598 213.222 224.288C215.983 231.902 220.816 238.824 226.338 244.362C210.461 265.127 189.061 281.048 164.21 288.661C139.359 296.967 112.438 296.967 87.5866 288.661ZM79.9932 54.7031C79.303 58.8563 77.2319 63.0093 73.7804 66.4702C70.3289 69.9311 66.8774 72.0077 62.0452 72.6998C57.9033 73.3921 53.0711 73.3921 48.9294 71.3155C44.7875 69.2388 41.336 66.4702 38.575 62.3172C36.5039 58.8563 35.1232 54.7031 35.1232 49.8578C35.1232 47.0891 35.8137 43.6281 36.5039 41.5516C37.8845 38.7828 39.2652 36.0141 41.336 33.9375C43.4071 31.861 46.1681 30.4766 48.9294 29.0922C51.6907 27.7079 54.4518 27.7079 57.2131 27.7079C62.0452 27.7079 66.1872 29.0922 70.3289 31.861C73.7804 34.6297 77.2319 38.0907 78.6125 42.2437C79.9932 45.7047 80.6834 49.8578 79.9932 54.7031ZM19.2464 269.28C20.627 266.512 22.0074 263.743 24.0785 261.666C26.1494 259.59 28.9107 258.205 31.6717 256.821C34.433 255.437 37.1943 255.437 39.9554 255.437H40.6458C44.0973 255.437 46.8586 256.129 49.6196 256.821C52.3809 258.205 55.1422 259.59 57.2131 261.666C59.2839 263.743 60.6646 266.512 62.0452 269.28C63.4259 272.049 63.4259 274.818 63.4259 278.279C63.4259 284.509 60.6646 290.046 56.5229 294.2C52.3809 298.353 46.8586 301.12 40.6458 301.12C37.8845 301.12 34.433 300.428 31.6717 299.737C28.9107 298.353 26.1494 296.967 24.0785 294.892C22.0074 292.814 19.9366 290.046 19.2464 287.277C17.8657 284.509 17.1753 281.74 17.1753 278.279C17.1753 274.818 17.8657 272.049 19.2464 269.28ZM239.454 198.678C240.835 195.909 242.214 193.14 244.285 191.063C246.356 188.987 249.119 187.603 251.879 186.218C254.639 184.834 257.402 184.834 260.162 184.834C260.162 184.834 260.162 184.834 260.854 184.834H263.615C268.446 185.526 273.279 187.602 276.729 191.063C280.871 195.217 283.634 200.754 283.634 206.984C283.634 213.213 281.563 218.751 276.729 222.904C272.587 227.057 266.375 229.826 260.854 229.826C254.639 229.134 249.119 227.057 244.977 222.904C240.835 218.751 238.073 213.213 238.073 207.676C237.383 204.907 238.072 201.446 239.454 198.678Z" fill="rgb(224 242 254)" />
                    </svg>
                </Box>
            }
        </Box>
    )
}

export default SideNavbar