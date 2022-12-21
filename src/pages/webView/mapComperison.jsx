import { Box, Typography, Fade, Tabs, Tab, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material'
import dynamic from 'next/dynamic';
import Head from 'next/head'
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react'
import Loader from '../../components/Loader';
import Tooltip from '@mui/material/Tooltip';
import mapItem from "../../../public/WebView/MapItem.png"
// import marker from "../../../public/WebView/Marker.png"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete'
import { getData } from '../../utils/localStorage';
import { useGetCompsQuery } from '../../services/query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { logicloseState } from '../../features/logicloseSlice';
import { useRouter } from 'next/router';
import IsAuthHOC from '../../components/IsAuthHOC'
import { BASE_URL } from '../../utils/api';

const GOOGLE_MAP_API_KEY = ''

const LogiCLoseWebLayout = dynamic(
    () => import("../../components/Logiclose/LogiCLoseWebLayout").then((p) => p.default),
    {
        ssr: false,
        loading: () => <Loader />,
    }
);

const MyMapComponent = withScriptjs(withGoogleMap(({ coords, selectedCoords }) => {

    return (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{
                lat: selectedCoords ? selectedCoords.lat : coords.length > 0 ? coords[0]?.lat : 24.45444,
                lng: selectedCoords ? selectedCoords.lng : coords.length > 0 ? coords[0]?.lng : 88.34343
            }}
            zoom={8}
            center={{
                lat: selectedCoords ? selectedCoords.lat : coords.length > 0 ? coords[0]?.lat : 24.45444,
                lng: selectedCoords ? selectedCoords.lng : coords.length > 0 ? coords[0]?.lng : 88.34343
            }}

        >
            {coords !== undefined && coords.length > 0 && coords.map((item, idx) =>
                <Marker key={idx}
                    position={{
                        lat: item.lat,
                        lng: item.lng
                    }}
                    icon={item.selected ? 'https://storage.googleapis.com/logiclose/MiniSelectedMarker.png' :
                        'https://storage.googleapis.com/logiclose/MiniMarker.png'}
                    labelAnchor={new google.maps.Point(0, 0)}
                    cursor="pointer"
                />
            )}
        </GoogleMap>)
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const columns = [
    { id: 'propertyname', label: 'Property Name', minWidth: 100, align: 'left', maxWidth: 200 },
    { id: 'address', label: 'Address', minWidth: 100, align: 'left', maxWidth: 50 },
    { id: 'bedRoomCount', label: 'Bedroom', minWidth: 100, align: 'left', maxWidth: 100 },
    { id: 'bathRoomCount', label: 'Bathroom', minWidth: 100, align: 'left', maxWidth: 100 },
    { id: 'avgRent', label: 'Avg Rent', minWidth: 100, align: 'left', maxWidth: 100 },
    { id: 'sqrFeet', label: 'SQFT', minWidth: 100, align: 'left', maxWidth: 100 },
    { id: 'priceSqrFt', label: 'Price Per SQFT', minWidth: 100, align: 'left', maxWidth: 100 }
];

const MapComperison = () => {

    const router = useRouter()
    let token = ''
    if (router.query.token) {
        token = router.query.token.split('____')[0]
    } else {
        token = getData('token')
    }
    const { data: compsData, isLoading: gettingComps, error: compsError } = useGetCompsQuery(token)

    const randomPass = useMemo(() => Math.floor(1000 + Math.random() * 9000), [token])
    const sharedUrl = useMemo(() =>
        `${BASE_URL}/webView/mapComperison?token=${token}____${randomPass}`
        , [BASE_URL, token])

    const [comps, setComps] = useState(null)
    const [allCoords, setAllCoords] = useState([])
    const [selectedCoords, setSelectedCoords] = useState(null)
    const [compId, setCompId] = useState(null)
    const [tableData, setTableData] = useState([])
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (selectedCoords) {
            const newCoords = allCoords.map((item) => {
                if (item.lat === selectedCoords.lat && item.lng === selectedCoords.lng) {
                    item['selected'] = true
                    return item
                } else {
                    item['selected'] = false
                    return item
                }
            })
            setAllCoords(newCoords)
        }
    }, [selectedCoords])

    useEffect(() => {
        if (compsData !== undefined) {
            (async () => {
                try {
                    const newcomps = JSON.parse(JSON.stringify(compsData))
                    const addressPromises = newcomps.comps.map((item) =>
                        geocodeByAddress(item.compText)
                    )
                    const allAddresses = await Promise.all(addressPromises)
                    const latlngPromises = allAddresses.map((item) =>
                        getLatLng(item[0])
                    )
                    const allLatLng = await Promise.all(latlngPromises)
                    setAllCoords(allLatLng)
                    newcomps.comps = newcomps.comps.map((item, idx) => {
                        item = JSON.parse(JSON.stringify(item))
                        item['latlng'] = allLatLng[idx]
                        return item
                    })
                    const newCompsArr = []
                    newcomps.comps.forEach((item, idx) => {
                        item = JSON.parse(JSON.stringify(item))
                        item.compData.forEach(cmp => {
                            const data = {
                                ...cmp,
                                ['priceSqrFt']: (cmp.avgRent / cmp.sqrFeet).toFixed(4),
                                ['propertyname']: item.label,
                                ['address']: item.compText
                                // cmp['latlng'] = allLatLng[idx]
                                // cmp['compText'] = item.compText
                                // cmp['images'] = item.images
                                // newCompsArr.push(cmp)
                            }
                            newCompsArr.push(data)
                        })
                    })
                    console.log('newCompsArr', newCompsArr);
                    setTableData(newCompsArr)
                    // newcomps.comps = newCompsArr
                    const newData = JSON.parse(JSON.stringify(newcomps))
                    setComps(newData)
                } catch (error) {
                    console.log('error', error);
                }
            })()
        }
    }, [compsData])

    return (
        <Box>
            <Head>
                <title>Comperison Map</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LogiCLoseWebLayout title={'Our Property'} queryToken={router.query.token} sharedUrl={sharedUrl} randomPass={randomPass}>
                <Box className='flex flex-col pt-2 pb-3 px-6'>
                    <Box className='flex flex-row items-center cursor-pointer z-10'
                        onClick={() => router.back()}>
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.35733 0.287593C4.48553 0.174603 4.68723 0.264055 4.68954 0.43493L4.73091 3.48936L15.8 3.48936C15.9105 3.48936 16 3.5789 16 3.68936V4.56609C16 4.67655 15.9105 4.76609 15.8 4.76609L4.73091 4.76609L4.68975 7.58312C4.68729 7.75094 4.49168 7.84129 4.36233 7.73434L0.180563 4.27701C0.0857868 4.19865 0.0835076 4.05413 0.175766 3.97282L4.35733 0.287593Z" fill="#469BD3" />
                        </svg>
                        <Typography variant='subtitle2' sx={{
                            color: "#469BD3", fontWeight: 400,
                            fontFamily: "Poppins", ml: 1
                        }}>
                            Back
                        </Typography>
                    </Box>
                    <Typography variant='h5' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins", mt: 1 }}>
                        Comperison Map
                    </Typography>
                    {/* <Typography variant='subtitle2' sx={{ fontSize: 20, color: "#989898", fontWeight: 400, fontFamily: "Poppins", mt: 2, mb: 1 }}>
                        Our Property
                    </Typography> */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Map View" {...a11yProps(0)} />
                            <Tab label="Grid View" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Box className='flex flex-row w-full z-10'>
                            <Box className='no-scrollbar px-3 cursor-pointer w-2/5'
                                sx={{ height: '68vh', overflowY: "scroll" }}>
                                {comps && comps.comps.length > 0 &&
                                    comps.comps.map((item, idx) =>
                                        <Box key={idx} className={`flex flex-row my-4 shadow-lg rounded-md p-2 ${compId === idx ? 'border-2' : 'border'} 
                                    ${compId === idx ? 'border-[#F27A30]' : ''}`} sx={{ width: '100%' }}
                                            onClick={() => {
                                                setSelectedCoords(item.latlng)
                                                setCompId(idx)
                                            }}>
                                            {item.images[0] &&
                                                <Box sx={{ width: 150 }}>
                                                    <img src={item.images[0]} />
                                                </Box>
                                            }
                                            <Box className='flex flex-col pl-3'>
                                                <Tooltip TransitionComponent={Fade}
                                                    TransitionProps={{ timeout: 600 }}
                                                    title={item.compText}
                                                >
                                                    <Typography variant='subtitle1' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                                                        {item.compText ? `${item.compText.slice(0, 28)}...` : '(no data found)'}
                                                    </Typography>
                                                </Tooltip>
                                                <Box className='flex flex-col mt-2'>
                                                    {item.compData.map((item, idx) =>
                                                        <Box key={idx} className='flex flex-row justify-between mt-2' sx={{ width: '100%' }}>
                                                            <Box className='flex lex-row items-center mr-1'>
                                                                <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2.20748 7.29689V0H0.015625V12.509H2.20748V10.4241H16.5276V12.509H18.7195V10.4241V7.29689H2.20748Z" fill="#469BD3" />
                                                                    <path d="M4.9476 3.12695C4.0397 3.12695 3.30371 3.827 3.30371 4.69057V6.25419H6.59149V4.69057C6.59149 3.827 5.8555 3.12695 4.9476 3.12695Z" fill="#469BD3" />
                                                                    <path d="M17.076 3.12695H9.33139C8.42349 3.12695 7.6875 3.827 7.6875 4.69057V6.25419H18.7198V4.69057C18.7198 3.827 17.9839 3.12695 17.076 3.12695Z" fill="#469BD3" />
                                                                </svg>
                                                                <Typography variant='subtitle2' sx={{ fontSize: 12, ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                                                    {item.bedRoomCount ? item.bedRoomCount : 0
                                                                        // `${item.bedRoomCount} bed room${item.bedRoomCount > 1 ? 's' : ''}` : '(no data found)'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                            <Box className='flex lex-row items-center mr-1'>
                                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M0.53125 8.89111V9.95238C0.53125 11.1789 1.43263 12.1987 2.60771 12.3844V13.169H3.3794V12.4147H9.82276V13.169H10.5944V12.3844C11.7695 12.1987 12.6709 11.1789 12.6709 9.95238V8.89111H0.53125Z" fill="#469BD3" />
                                                                    <path d="M1.30214 6.57555V2.12351C1.30214 1.37811 1.90859 0.771686 2.65398 0.771686C3.34431 0.771686 3.91503 1.29189 3.99567 1.96082C3.19211 2.1418 2.58994 2.86075 2.58994 3.71817V4.23271H6.19338V3.71817C6.19338 2.85458 5.58254 2.13133 4.77037 1.95683C4.68494 0.863617 3.76872 0 2.65398 0C1.48307 0 0.530451 0.952589 0.530451 2.12351V6.57555H0.015625V8.12013H13.185V6.57555H1.30214Z" fill="#469BD3" />
                                                                </svg>
                                                                <Typography variant='subtitle2' sx={{ fontSize: 12, ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                                                    {item.bathRoomCount ? item.bathRoomCount : 0
                                                                        // `${item.bathRoomCount} bath room${item.bathRoomCount > 1 ? 's' : ''}` : '(no data found)'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                            <Box className='flex flex-row items-center'>
                                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="14" cy="14" r="14" fill="#469BD3" />
                                                                    <path d="M13.6638 19.0723H11.3221C9.81853 19.0723 8.59481 18.9944 8.59481 17.7011V14.4394H7.72901C7.43351 14.4394 7.1682 14.2852 7.05525 14.0499C6.94267 13.8132 7.00549 13.5418 7.21316 13.3611L12.9695 8.37036C13.2445 8.13156 13.6108 8 13.9998 8C14.3889 8 14.7554 8.13157 15.0305 8.37036C15.9832 9.19633 16.6976 9.81577 17.174 10.2288C17.2085 10.2587 17.3042 10.3417 17.3248 10.3595C17.3385 10.3713 17.3453 10.2896 17.3453 10.1141C17.3809 9.67798 17.7946 9.33367 18.307 9.33367H18.3128C18.8478 9.33367 19.2807 9.70897 19.2807 10.1725V11.9152C19.2807 11.9616 19.2733 12.0018 19.2652 12.0429L20.7868 13.361C20.9953 13.5418 21.0573 13.8132 20.9443 14.0499C20.8317 14.2852 20.566 14.4394 20.2709 14.4394H19.2807V14.8564C20.3171 15.457 21 16.4833 21 17.6483C21 19.4994 19.2763 21 17.1502 21C15.6087 21 14.2789 20.2114 13.6639 19.0725L13.6638 19.0723ZM17.1501 20.695C19.0831 20.695 20.6502 19.3309 20.6502 17.6481C20.6502 15.9654 19.0832 14.6014 17.1501 14.6014C15.2171 14.6014 13.65 15.9654 13.65 17.6481C13.65 19.3308 15.217 20.695 17.1501 20.695ZM18.5975 18.2074C18.5975 18.4316 18.5052 18.6254 18.3206 18.7888C18.136 18.9522 17.8683 19.0568 17.5178 19.1027V19.3095C17.5178 19.4437 17.3927 19.5526 17.2385 19.5526C17.0843 19.5526 16.9593 19.4437 16.9593 19.3095V19.119C16.7265 19.1055 16.5062 19.071 16.2983 19.0157C16.169 18.9813 16.0534 18.9418 15.9517 18.8974C15.8538 18.8546 15.8117 18.7524 15.8563 18.6653C15.8577 18.6624 15.8592 18.6596 15.8606 18.6569L16.0119 18.361C16.0477 18.2911 16.1417 18.2597 16.222 18.2908C16.2255 18.2922 16.2291 18.2937 16.2326 18.2953C16.2406 18.2991 16.2482 18.3025 16.2552 18.3056C16.3581 18.3509 16.4702 18.3897 16.5915 18.4221C16.7839 18.4734 16.9732 18.4991 17.1593 18.4991C17.5131 18.4991 17.69 18.4221 17.69 18.2682C17.69 18.1871 17.6396 18.127 17.5387 18.0878C17.4378 18.0487 17.2757 18.0075 17.0523 17.9643C16.8072 17.9183 16.6024 17.8691 16.438 17.8163C16.2735 17.7637 16.1323 17.6793 16.0144 17.5632C15.8965 17.4471 15.8375 17.2904 15.8375 17.0932C15.8375 16.8609 15.9337 16.6617 16.1261 16.4955C16.3185 16.3294 16.5962 16.2275 16.9593 16.1897V15.9871C16.9593 15.8528 17.0843 15.744 17.2385 15.744C17.3927 15.744 17.5178 15.8528 17.5178 15.9871V16.1816C17.6946 16.1951 17.8645 16.2221 18.0273 16.2626C18.1421 16.2912 18.2482 16.3258 18.3452 16.3664C18.3534 16.3698 18.3625 16.3737 18.3727 16.3783C18.424 16.4013 18.4464 16.4546 18.4243 16.5009L18.2131 16.9441C18.1956 16.9807 18.1472 16.9981 18.1051 16.9829C18.1032 16.9822 18.1014 16.9815 18.0996 16.9807C18.0841 16.974 18.0709 16.9683 18.06 16.9638C17.7914 16.8529 17.5301 16.7974 17.2757 16.7974C17.0927 16.7974 16.9593 16.8211 16.8754 16.8684C16.7917 16.9155 16.7498 16.9771 16.7498 17.0527C16.7498 17.1283 16.7994 17.185 16.8987 17.2229C16.998 17.2607 17.1579 17.2998 17.3781 17.3404C17.6263 17.3863 17.8319 17.4356 17.9948 17.4882C18.1577 17.5409 18.2989 17.6246 18.4183 17.7395C18.5378 17.8542 18.5975 18.0102 18.5975 18.2074L18.5975 18.2074Z" fill="white" />
                                                                </svg>
                                                                <Typography variant='subtitle2' sx={{ ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                                                    {item.avgRent ? `$${item.avgRent}` : 0}
                                                                </Typography>
                                                            </Box>
                                                            <Box className='flex flex-row items-center'>
                                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="14" cy="14" r="14" fill="#469BD3" />
                                                                    <path d="M9.35534 9.00057C9.15597 9.01075 8.99968 9.17194 9 9.3672V19.6334C9 19.8358 9.16783 20 9.37492 20H18.6233C18.7715 20.0006 18.9061 19.9159 18.9669 19.7838C19.0278 19.6517 19.0033 19.4969 18.9046 19.3889L9.65616 9.12274C9.58018 9.03937 9.46947 8.99441 9.35536 9.00056L9.35534 9.00057ZM9.74985 10.3373L17.7954 19.2666H9.74985V18.9H10.3748C10.4751 18.9013 10.5719 18.8633 10.6433 18.7945C10.7148 18.7255 10.7551 18.6315 10.7551 18.5333C10.7551 18.4352 10.7148 18.3411 10.6433 18.2722C10.5719 18.2033 10.4751 18.1653 10.3748 18.1666H9.74985V17.8H10.1248C10.2252 17.8014 10.3219 17.7634 10.3933 17.6945C10.4649 17.6256 10.5051 17.5316 10.5051 17.4334C10.5051 17.3353 10.4649 17.2412 10.3933 17.1723C10.3219 17.1033 10.2252 17.0653 10.1248 17.0668H9.74985V16.5779H10.1248C10.2252 16.5793 10.3219 16.5413 10.3933 16.4724C10.4649 16.4034 10.5051 16.3094 10.5051 16.2113C10.5051 16.1131 10.4649 16.0191 10.3933 15.9501C10.3219 15.8813 10.2252 15.8433 10.1248 15.8446H9.74985V15.4779H10.3748C10.4751 15.4794 10.5719 15.4414 10.6433 15.3724C10.7148 15.3035 10.7551 15.2095 10.7551 15.1113C10.7551 15.0132 10.7148 14.9192 10.6433 14.8502C10.5719 14.7813 10.4751 14.7433 10.3748 14.7447H9.74985V14.378H10.1248C10.2252 14.3795 10.3219 14.3415 10.3933 14.2725C10.4649 14.2037 10.5051 14.1096 10.5051 14.0114C10.5051 13.9132 10.4649 13.8192 10.3933 13.7503C10.3219 13.6814 10.2252 13.6434 10.1248 13.6448H9.74985V13.2782H10.1248C10.2252 13.2795 10.3219 13.2415 10.3933 13.1726C10.4649 13.1037 10.5051 13.0096 10.5051 12.9115C10.5051 12.8133 10.4649 12.7193 10.3933 12.6503C10.3219 12.5815 10.2252 12.5435 10.1248 12.5448H9.74985V12.1782H10.3748C10.4751 12.1796 10.5719 12.1416 10.6433 12.0726C10.7148 12.0038 10.7551 11.9097 10.7551 11.8115C10.7551 11.7134 10.7148 11.6194 10.6433 11.5504C10.5719 11.4816 10.4751 11.4435 10.3748 11.4449H9.74985V10.3373ZM11.726 14.5002C11.5282 14.5123 11.3742 14.6729 11.3746 14.8668V17.5556C11.3746 17.758 11.5424 17.9221 11.7495 17.9222H14.2491C14.3981 17.9227 14.5333 17.8368 14.5935 17.7035C14.6536 17.5701 14.6273 17.4146 14.5264 17.3073L12.0268 14.6185C11.95 14.5365 11.8395 14.493 11.726 14.5L11.726 14.5002ZM12.1245 15.814L13.4055 17.1889H12.1245V15.814Z" fill="white" />
                                                                </svg>
                                                                <Typography variant='subtitle2' sx={{ ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                                                    {item.sqrFeet ? `${item.sqrFeet} sqft` : ''}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Box>
                            <MyMapComponent googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initMap&v=weekly&v=3.exp&libraries=geometry,drawing,places`}
                                loadingElement={<div style={{ height: '100%', width: '100%' }} />}
                                containerElement={<div style={{ width: '60%' }} />}
                                mapElement={<div style={{ height: '100%', width: '100%' }} />}
                                coords={allCoords} selectedCoords={selectedCoords}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{
                                                    minWidth: column.minWidth,
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((rowItem, idx) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                                                    {columns.map((colItem, idx2) => {
                                                        const value = rowItem[colItem.id];
                                                        return (
                                                            <TableCell key={idx2} align={colItem.align}>
                                                                {value}
                                                                {/* {colItem.id === 'address' ? value.slice(0, 40) : value} */}
                                                            </TableCell>
                                                        )
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TabPanel>
                </Box>
            </LogiCLoseWebLayout>
        </Box>
    )
}

export default MapComperison
// export default IsAuthHOC(MapComperison, "/webView/mapComperison")

{/* <Box sx={{ width: 500, height: 300 }}> */ }
{/* <Image src={mapImg} width={700} height={300} /> */ }
{/* </Box> */ }

 // :
                                // [1, 2, 3, 4, 5, 6].map((item, idx) =>
                                //     <Box key={idx} className={`flex flex-row my-4 shadow-lg rounded-md p-2 border`}
                                //         sx={{ width: '100%' }}>
                                //         <Image src={mapItem} width={160} height={170} />
                                //         <Box className='flex flex-col pl-3'>
                                //             <Typography variant='subtitle1' sx={{ color: "#061D2E", fontWeight: 600, fontFamily: "Poppins" }}>
                                //                 Fully Furnished Smart Studio Apartment
                                //             </Typography>
                                //             <Box className='flex flex-row justify-between mt-2' sx={{ width: '100%' }}>
                                //                 {/* <Box className='flex lex-row items-center mr-1'>
                                //                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                //                         <path fillRule="evenodd" clipRule="evenodd" d="M6.99825 0C5.84399 0 4.90093 1.76838 4.90093 3.93323C4.90093 4.44076 4.95611 4.92405 5.05034 5.37084C5.03482 5.38055 5.02016 5.39187 5.00477 5.4018C4.81643 5.13567 4.59705 4.92637 4.3549 4.7589C4.40023 4.47914 4.43152 4.18807 4.43152 3.88198C4.43152 2.20065 3.69567 0.820345 2.79906 0.820345C1.90258 0.820345 1.16575 2.20065 1.16575 3.88198C1.16575 4.18668 1.1974 4.47686 1.24224 4.75565C0.99552 4.92821 0.771706 5.14028 0.582382 5.40499C0.255227 5.86263 0.000504527 6.5261 0 7.32146V7.32308V10.4496C0 10.6818 0.0491473 10.9042 0.136601 11.0685C0.224177 11.2325 0.342921 11.3249 0.466593 11.3249H3.2676V13.1282C3.26809 13.3592 3.31712 13.5805 3.4042 13.7436C3.49129 13.9069 3.60929 13.9991 3.73233 14H10.2675C10.3907 13.9991 10.5087 13.9069 10.5957 13.7436C10.6828 13.5805 10.7319 13.3592 10.7324 13.1282V11.3778H13.5333C13.6572 11.3778 13.7761 11.2854 13.8636 11.1209C13.9512 10.9564 14.0002 10.7332 14 10.5009V7.37435V7.37251C13.999 6.57803 13.7435 5.91343 13.4166 5.45628C13.2273 5.19154 13.0036 4.98062 12.7568 4.80853C12.8019 4.529 12.8343 4.23862 12.8343 3.93321C12.8343 2.25188 12.0974 0.871571 11.2009 0.871571C10.3043 0.871571 9.56849 2.25188 9.56849 3.93321C9.56849 4.23861 9.5999 4.52898 9.64498 4.80853C9.41218 4.96932 9.1997 5.16867 9.01618 5.4205C8.99352 5.40595 8.97159 5.39024 8.94868 5.37615C9.04389 4.92798 9.09994 4.44263 9.09994 3.93327C9.09994 1.76848 8.15247 3.60957e-05 6.99821 3.60957e-05L6.99825 0ZM6.99825 1.7504C7.64798 1.7504 8.16582 2.71443 8.16582 3.93323C8.16582 4.49667 8.05188 5.00187 7.8686 5.38794C7.82758 5.4748 7.78274 5.55311 7.73556 5.62565C7.71881 5.65129 7.70292 5.67878 7.68543 5.70257C7.63616 5.7698 7.58357 5.82686 7.52962 5.87861C7.51213 5.89524 7.49562 5.91488 7.47764 5.92989C7.41716 5.98095 7.35434 6.01837 7.2898 6.04956C7.27551 6.05649 7.26245 6.06781 7.24792 6.07358C7.17734 6.10223 7.10429 6.11401 7.031 6.11794C7.02103 6.1184 7.01179 6.12463 7.00181 6.12487C6.91694 6.12463 6.83269 6.10685 6.75115 6.07358C6.74746 6.07196 6.74401 6.06988 6.74019 6.0685C6.5824 6.00058 6.43434 5.87168 6.30453 5.69056C6.29689 5.67994 6.29024 5.66746 6.28273 5.65637C6.2257 5.57252 6.17248 5.4785 6.12408 5.37431C5.94535 4.98967 5.83425 4.49047 5.83425 3.93326C5.83425 2.71446 6.34839 1.75044 6.99825 1.75044L6.99825 1.7504ZM2.79901 2.57096C3.19121 2.57096 3.49815 3.14664 3.49815 3.88196C3.49815 4.21739 3.4325 4.5177 3.32583 4.7487C3.29553 4.81362 3.2624 4.87299 3.22655 4.92473C3.22458 4.92751 3.22298 4.93051 3.22101 4.93328C3.18258 4.9878 3.14132 5.03354 3.09796 5.07165C3.09624 5.07327 3.09513 5.0772 3.0934 5.07858C3.04832 5.11763 3.0009 5.1472 2.95212 5.16752C2.90297 5.18809 2.85222 5.19825 2.80086 5.19825C2.5954 5.19756 2.40055 5.02892 2.26764 4.73507C2.2653 4.72976 2.26283 4.72468 2.26037 4.71959C2.16121 4.49227 2.1 4.20397 2.1 3.88195C2.1 3.14661 2.40695 2.57095 2.79902 2.57095L2.79901 2.57096ZM11.201 2.62224C11.593 2.62224 11.901 3.19793 11.901 3.93324C11.901 4.2555 11.8388 4.54521 11.7396 4.77272C11.7374 4.77711 11.7353 4.78173 11.7332 4.78635C11.6003 5.07974 11.4062 5.24907 11.2009 5.24953C10.9954 5.24884 10.8006 5.0802 10.6677 4.78635C10.6642 4.77942 10.6605 4.77249 10.6568 4.76579C10.5587 4.5394 10.4981 4.25202 10.4981 3.93323C10.4981 3.19789 10.8088 2.62223 11.201 2.62223L11.201 2.62224ZM1.80919 6.30088C2.08522 6.70215 2.42616 6.95212 2.79904 6.95212C3.16759 6.95212 3.50544 6.70909 3.77977 6.31614C3.8421 6.35795 3.89211 6.40415 3.942 6.4529C3.59933 6.96944 3.33978 7.63615 3.28129 8.41212C3.2718 8.52116 3.26675 8.63343 3.26663 8.7487V8.75055V9.57436H0.933317V7.32317C0.93344 7.23192 0.96448 7.05381 1.14111 6.80685C1.27882 6.61419 1.53578 6.44624 1.80923 6.30094L1.80919 6.30088ZM12.1908 6.35216C12.464 6.49747 12.7212 6.66703 12.8589 6.85993C13.0358 7.10734 13.0666 7.28499 13.0667 7.37601V9.62561H10.7334V8.75053V8.74706C10.733 8.63363 10.7281 8.52437 10.7187 8.41718C10.6617 7.65505 10.4107 7.00014 10.078 6.48705C10.1226 6.44477 10.1668 6.40273 10.2211 6.36577C10.4954 6.75872 10.8324 7.00335 11.201 7.00335C11.5738 7.00335 11.9148 6.75339 12.1908 6.3521L12.1908 6.35216ZM5.6335 6.8992C5.95129 7.41644 6.34952 7.75211 6.78925 7.83597C6.85724 7.8593 6.92622 7.87501 6.99803 7.87524H7.0016C7.07501 7.87524 7.14547 7.85861 7.21494 7.83412C7.65183 7.74772 8.0476 7.41344 8.36429 6.89919C8.61606 7.0207 8.84233 7.16716 9.03597 7.33326C9.12577 7.41342 9.2131 7.49428 9.28478 7.57767C9.31065 7.60701 9.3359 7.63519 9.35955 7.66499C9.56328 7.92581 9.69273 8.19263 9.75333 8.42387C9.7537 8.42548 9.75383 8.42756 9.7542 8.42918C9.78437 8.54584 9.79792 8.65511 9.79891 8.74867V12.2496H4.20055V8.74701C4.20055 8.74447 4.20141 8.741 4.20141 8.73846C4.20265 8.64767 4.21681 8.54303 4.24514 8.43076C4.24736 8.42175 4.24933 8.41251 4.25154 8.4035C4.314 8.17318 4.44284 7.91052 4.64533 7.65296C4.67083 7.62131 4.69669 7.5899 4.72465 7.55894C4.79043 7.48317 4.87197 7.41132 4.95253 7.33855C5.14776 7.17061 5.3775 7.0223 5.63333 6.89917L5.6335 6.8992Z" fill="#469BD3" />
                                //                     </svg>
                                //                     <Typography variant='subtitle2' sx={{ fontSize: 12, ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                //                         2 guests
                                //                     </Typography>
                                //                 </Box> */}
                                //                 <Box className='flex lex-row items-center mr-1'>
                                //                     <svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                //                         <path d="M2.20748 7.29689V0H0.015625V12.509H2.20748V10.4241H16.5276V12.509H18.7195V10.4241V7.29689H2.20748Z" fill="#469BD3" />
                                //                         <path d="M4.9476 3.12695C4.0397 3.12695 3.30371 3.827 3.30371 4.69057V6.25419H6.59149V4.69057C6.59149 3.827 5.8555 3.12695 4.9476 3.12695Z" fill="#469BD3" />
                                //                         <path d="M17.076 3.12695H9.33139C8.42349 3.12695 7.6875 3.827 7.6875 4.69057V6.25419H18.7198V4.69057C18.7198 3.827 17.9839 3.12695 17.076 3.12695Z" fill="#469BD3" />
                                //                     </svg>
                                //                     <Typography variant='subtitle2' sx={{ fontSize: 12, ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                //                         1 bedroom
                                //                     </Typography>
                                //                 </Box>
                                //                 <Box className='flex lex-row items-center mr-1'>
                                //                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                //                         <path d="M0.53125 8.89111V9.95238C0.53125 11.1789 1.43263 12.1987 2.60771 12.3844V13.169H3.3794V12.4147H9.82276V13.169H10.5944V12.3844C11.7695 12.1987 12.6709 11.1789 12.6709 9.95238V8.89111H0.53125Z" fill="#469BD3" />
                                //                         <path d="M1.30214 6.57555V2.12351C1.30214 1.37811 1.90859 0.771686 2.65398 0.771686C3.34431 0.771686 3.91503 1.29189 3.99567 1.96082C3.19211 2.1418 2.58994 2.86075 2.58994 3.71817V4.23271H6.19338V3.71817C6.19338 2.85458 5.58254 2.13133 4.77037 1.95683C4.68494 0.863617 3.76872 0 2.65398 0C1.48307 0 0.530451 0.952589 0.530451 2.12351V6.57555H0.015625V8.12013H13.185V6.57555H1.30214Z" fill="#469BD3" />
                                //                     </svg>
                                //                     <Typography variant='subtitle2' sx={{ fontSize: 12, ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                //                         2 bathroom
                                //                     </Typography>
                                //                 </Box>
                                //             </Box>
                                //             <Box className='flex flex-col mt-4'>
                                //                 <Box className='flex flex-row items-center'>
                                //                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                //                         <circle cx="14" cy="14" r="14" fill="#469BD3" />
                                //                         <path d="M13.6638 19.0723H11.3221C9.81853 19.0723 8.59481 18.9944 8.59481 17.7011V14.4394H7.72901C7.43351 14.4394 7.1682 14.2852 7.05525 14.0499C6.94267 13.8132 7.00549 13.5418 7.21316 13.3611L12.9695 8.37036C13.2445 8.13156 13.6108 8 13.9998 8C14.3889 8 14.7554 8.13157 15.0305 8.37036C15.9832 9.19633 16.6976 9.81577 17.174 10.2288C17.2085 10.2587 17.3042 10.3417 17.3248 10.3595C17.3385 10.3713 17.3453 10.2896 17.3453 10.1141C17.3809 9.67798 17.7946 9.33367 18.307 9.33367H18.3128C18.8478 9.33367 19.2807 9.70897 19.2807 10.1725V11.9152C19.2807 11.9616 19.2733 12.0018 19.2652 12.0429L20.7868 13.361C20.9953 13.5418 21.0573 13.8132 20.9443 14.0499C20.8317 14.2852 20.566 14.4394 20.2709 14.4394H19.2807V14.8564C20.3171 15.457 21 16.4833 21 17.6483C21 19.4994 19.2763 21 17.1502 21C15.6087 21 14.2789 20.2114 13.6639 19.0725L13.6638 19.0723ZM17.1501 20.695C19.0831 20.695 20.6502 19.3309 20.6502 17.6481C20.6502 15.9654 19.0832 14.6014 17.1501 14.6014C15.2171 14.6014 13.65 15.9654 13.65 17.6481C13.65 19.3308 15.217 20.695 17.1501 20.695ZM18.5975 18.2074C18.5975 18.4316 18.5052 18.6254 18.3206 18.7888C18.136 18.9522 17.8683 19.0568 17.5178 19.1027V19.3095C17.5178 19.4437 17.3927 19.5526 17.2385 19.5526C17.0843 19.5526 16.9593 19.4437 16.9593 19.3095V19.119C16.7265 19.1055 16.5062 19.071 16.2983 19.0157C16.169 18.9813 16.0534 18.9418 15.9517 18.8974C15.8538 18.8546 15.8117 18.7524 15.8563 18.6653C15.8577 18.6624 15.8592 18.6596 15.8606 18.6569L16.0119 18.361C16.0477 18.2911 16.1417 18.2597 16.222 18.2908C16.2255 18.2922 16.2291 18.2937 16.2326 18.2953C16.2406 18.2991 16.2482 18.3025 16.2552 18.3056C16.3581 18.3509 16.4702 18.3897 16.5915 18.4221C16.7839 18.4734 16.9732 18.4991 17.1593 18.4991C17.5131 18.4991 17.69 18.4221 17.69 18.2682C17.69 18.1871 17.6396 18.127 17.5387 18.0878C17.4378 18.0487 17.2757 18.0075 17.0523 17.9643C16.8072 17.9183 16.6024 17.8691 16.438 17.8163C16.2735 17.7637 16.1323 17.6793 16.0144 17.5632C15.8965 17.4471 15.8375 17.2904 15.8375 17.0932C15.8375 16.8609 15.9337 16.6617 16.1261 16.4955C16.3185 16.3294 16.5962 16.2275 16.9593 16.1897V15.9871C16.9593 15.8528 17.0843 15.744 17.2385 15.744C17.3927 15.744 17.5178 15.8528 17.5178 15.9871V16.1816C17.6946 16.1951 17.8645 16.2221 18.0273 16.2626C18.1421 16.2912 18.2482 16.3258 18.3452 16.3664C18.3534 16.3698 18.3625 16.3737 18.3727 16.3783C18.424 16.4013 18.4464 16.4546 18.4243 16.5009L18.2131 16.9441C18.1956 16.9807 18.1472 16.9981 18.1051 16.9829C18.1032 16.9822 18.1014 16.9815 18.0996 16.9807C18.0841 16.974 18.0709 16.9683 18.06 16.9638C17.7914 16.8529 17.5301 16.7974 17.2757 16.7974C17.0927 16.7974 16.9593 16.8211 16.8754 16.8684C16.7917 16.9155 16.7498 16.9771 16.7498 17.0527C16.7498 17.1283 16.7994 17.185 16.8987 17.2229C16.998 17.2607 17.1579 17.2998 17.3781 17.3404C17.6263 17.3863 17.8319 17.4356 17.9948 17.4882C18.1577 17.5409 18.2989 17.6246 18.4183 17.7395C18.5378 17.8542 18.5975 18.0102 18.5975 18.2074L18.5975 18.2074Z" fill="white" />
                                //                     </svg>
                                //                     <Typography variant='subtitle2' sx={{ ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                //                         (no data found)
                                //                     </Typography>
                                //                 </Box>
                                //                 <Box className='flex flex-row mt-2 items-center'>
                                //                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                //                         <circle cx="14" cy="14" r="14" fill="#469BD3" />
                                //                         <path d="M9.35534 9.00057C9.15597 9.01075 8.99968 9.17194 9 9.3672V19.6334C9 19.8358 9.16783 20 9.37492 20H18.6233C18.7715 20.0006 18.9061 19.9159 18.9669 19.7838C19.0278 19.6517 19.0033 19.4969 18.9046 19.3889L9.65616 9.12274C9.58018 9.03937 9.46947 8.99441 9.35536 9.00056L9.35534 9.00057ZM9.74985 10.3373L17.7954 19.2666H9.74985V18.9H10.3748C10.4751 18.9013 10.5719 18.8633 10.6433 18.7945C10.7148 18.7255 10.7551 18.6315 10.7551 18.5333C10.7551 18.4352 10.7148 18.3411 10.6433 18.2722C10.5719 18.2033 10.4751 18.1653 10.3748 18.1666H9.74985V17.8H10.1248C10.2252 17.8014 10.3219 17.7634 10.3933 17.6945C10.4649 17.6256 10.5051 17.5316 10.5051 17.4334C10.5051 17.3353 10.4649 17.2412 10.3933 17.1723C10.3219 17.1033 10.2252 17.0653 10.1248 17.0668H9.74985V16.5779H10.1248C10.2252 16.5793 10.3219 16.5413 10.3933 16.4724C10.4649 16.4034 10.5051 16.3094 10.5051 16.2113C10.5051 16.1131 10.4649 16.0191 10.3933 15.9501C10.3219 15.8813 10.2252 15.8433 10.1248 15.8446H9.74985V15.4779H10.3748C10.4751 15.4794 10.5719 15.4414 10.6433 15.3724C10.7148 15.3035 10.7551 15.2095 10.7551 15.1113C10.7551 15.0132 10.7148 14.9192 10.6433 14.8502C10.5719 14.7813 10.4751 14.7433 10.3748 14.7447H9.74985V14.378H10.1248C10.2252 14.3795 10.3219 14.3415 10.3933 14.2725C10.4649 14.2037 10.5051 14.1096 10.5051 14.0114C10.5051 13.9132 10.4649 13.8192 10.3933 13.7503C10.3219 13.6814 10.2252 13.6434 10.1248 13.6448H9.74985V13.2782H10.1248C10.2252 13.2795 10.3219 13.2415 10.3933 13.1726C10.4649 13.1037 10.5051 13.0096 10.5051 12.9115C10.5051 12.8133 10.4649 12.7193 10.3933 12.6503C10.3219 12.5815 10.2252 12.5435 10.1248 12.5448H9.74985V12.1782H10.3748C10.4751 12.1796 10.5719 12.1416 10.6433 12.0726C10.7148 12.0038 10.7551 11.9097 10.7551 11.8115C10.7551 11.7134 10.7148 11.6194 10.6433 11.5504C10.5719 11.4816 10.4751 11.4435 10.3748 11.4449H9.74985V10.3373ZM11.726 14.5002C11.5282 14.5123 11.3742 14.6729 11.3746 14.8668V17.5556C11.3746 17.758 11.5424 17.9221 11.7495 17.9222H14.2491C14.3981 17.9227 14.5333 17.8368 14.5935 17.7035C14.6536 17.5701 14.6273 17.4146 14.5264 17.3073L12.0268 14.6185C11.95 14.5365 11.8395 14.493 11.726 14.5L11.726 14.5002ZM12.1245 15.814L13.4055 17.1889H12.1245V15.814Z" fill="white" />
                                //                     </svg>
                                //                     <Typography variant='subtitle2' sx={{ ml: 1, color: "#3E4958", fontFamily: "Poppins" }}>
                                //                         (no data found)
                                //                     </Typography>
                                //                 </Box>
                                //             </Box>
                                //         </Box>
                                //     </Box>
                                // )