import { Box, Typography, Grid, Paper } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useMemo } from 'react'
import floorBackground from "../../../public/WebView/FloorBack.png"

const Summary = ({ propertySummary, propertySummaryState }) => {

    const summaryData = useMemo(() => {
        if (!propertySummary) {
            return []
        }
        return Object.keys(propertySummary).filter(item =>
            propertySummary[item].text).map(item => propertySummary[item])
    }, [propertySummary])


    return (
        <Box className='flex flex-row justify-between'>
            <Box className='flex flex-col w-4/6 mt-6 bg-[#f8fafc]
                       px-4 py-2 rounded-xl'>
                {propertySummary &&
                    <Grid container component="main">
                        {[...summaryData, ...propertySummary.others].map((item, idx) =>
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
            <Box sx={{ width: '30%', mt: 4 }}>
                <Image src={floorBackground} layout='responsive' />
            </Box>
        </Box>
    )
}

export default Summary

{/* <Box className='flex flex-row justify-between mt-4'>
                    {((propertySummary && propertySummary.propertyAddress.text) ||
                        (propertySummaryState && propertySummaryState[0].value)) &&
                        <Box sx={{ width: '50%' }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.propertyAddress && propertySummary.propertyAddress.text ?
                                    propertySummary.propertyAddress.subtitle :
                                    propertySummaryState && propertySummaryState[0] ?
                                        propertySummaryState[0].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.propertyAddress ?
                                    propertySummary.propertyAddress.text :
                                    propertySummaryState && propertySummaryState[0].value ?
                                        propertySummaryState[0].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.netwark.text) ||
                        (propertySummaryState && propertySummaryState[2].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.netwark && propertySummary.netwark.text ?
                                    propertySummary.netwark.subtitle :
                                    propertySummaryState && propertySummaryState[2] ?
                                        propertySummaryState[2].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.netwark ?
                                    propertySummary.netwark.text :
                                    propertySummaryState && propertySummaryState[2].value ?
                                        propertySummaryState[2].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                </Box>

                <Box className='flex flex-row justify-between mt-5'>
                    {((propertySummary && propertySummary.yearBuilt.text) ||
                        (propertySummaryState && propertySummaryState[1].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.yearBuilt && propertySummary.yearBuilt.text ?
                                    propertySummary.yearBuilt.subtitle :
                                    propertySummaryState && propertySummaryState[1] ?
                                        propertySummaryState[1].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.yearBuilt.text ?
                                    propertySummary.yearBuilt.text :
                                    propertySummaryState && propertySummaryState[1].value ?
                                        propertySummaryState[1].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.units.text) ||
                        (propertySummaryState && propertySummaryState[3].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.units && propertySummary.units.text ?
                                    propertySummary.units.subtitle :
                                    propertySummaryState && propertySummaryState[3] ?
                                        propertySummaryState[3].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.units.text ?
                                    propertySummary.units.text :
                                    propertySummaryState && propertySummaryState[3].value ?
                                        propertySummaryState[3].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.avgUnitsize.text) ||
                        (propertySummaryState && propertySummaryState[4].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgUnitsize && propertySummary.avgUnitsize.text ?
                                    propertySummary.avgUnitsize.subtitle :
                                    propertySummaryState && propertySummaryState[4] ?
                                        propertySummaryState[4].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgUnitsize.text ?
                                    propertySummary.avgUnitsize.text :
                                    propertySummaryState && propertySummaryState[4].value ?
                                        propertySummaryState[4].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.rentSqrft.text) ||
                        (propertySummaryState && propertySummaryState[8].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.rentSqrft && propertySummary.rentSqrft.text ?
                                    propertySummary.rentSqrft.subtitle :
                                    propertySummaryState && propertySummaryState[8] ?
                                        propertySummaryState[8].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.rentSqrft.text ?
                                    propertySummary.rentSqrft.text :
                                    propertySummaryState && propertySummaryState[8].value ?
                                        propertySummaryState[8].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                </Box>

                <Box className='flex flex-row justify-between mt-5'>
                    {((propertySummary && propertySummary.avgRent.text) ||
                        (propertySummaryState && propertySummaryState[5].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgRent && propertySummary.avgRent.text ?
                                    propertySummary.avgRent.subtitle :
                                    propertySummaryState && propertySummaryState[5] ?
                                        propertySummaryState[5].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgRent.text ?
                                    `$${propertySummary.avgRent.text}` :
                                    propertySummaryState && propertySummaryState[5].value ?
                                        `$${propertySummaryState[5].value}` :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.avgRentpsf.text) ||
                        (propertySummaryState && propertySummaryState[9].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgRentpsf && propertySummary.avgRentpsf.text ?
                                    propertySummary.avgRentpsf.subtitle :
                                    propertySummaryState && propertySummaryState[9] ?
                                        propertySummaryState[9].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.avgRentpsf.text ?
                                    `$${propertySummary.avgRentpsf.text}` :
                                    propertySummaryState && propertySummaryState[9].value ?
                                        `$${propertySummaryState[9].value}` :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.currentOccupancy.text) ||
                        (propertySummaryState && propertySummaryState[6].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.currentOccupancy && propertySummary.currentOccupancy.text ?
                                    propertySummary.currentOccupancy.subtitle :
                                    propertySummaryState && propertySummaryState[6] ?
                                        propertySummaryState[6].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.currentOccupancy.text ?
                                    `$${propertySummary.currentOccupancy.text}` :
                                    propertySummaryState && propertySummaryState[6].value ?
                                        `$${propertySummaryState[6].value}` :
                                        ''}
                            </Typography>
                        </Box>
                    }
                </Box>

                <Box className='flex flex-row justify-between mt-5'>
                    {((propertySummary && propertySummary.parkingSpaces.text) ||
                        (propertySummaryState && propertySummaryState[10].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.parkingSpaces && propertySummary.parkingSpaces.text ?
                                    propertySummary.parkingSpaces.subtitle :
                                    propertySummaryState && propertySummaryState[10] ?
                                        propertySummaryState[10].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.parkingSpaces.text ?
                                    `${propertySummary.parkingSpaces.text}` :
                                    propertySummaryState && propertySummaryState[10].value ?
                                        `${propertySummaryState[10].value}` :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.taxParcel.text) ||
                        (propertySummaryState && propertySummaryState[11].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.taxParcel && propertySummary.taxParcel.text ?
                                    propertySummary.taxParcel.subtitle :
                                    propertySummaryState && propertySummaryState[11] ?
                                        propertySummaryState[11].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.taxParcel.text ?
                                    propertySummary.taxParcel.text :
                                    propertySummaryState && propertySummaryState[11].value ?
                                        propertySummaryState[11].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                    {((propertySummary && propertySummary.zoning.text) ||
                        (propertySummaryState && propertySummaryState[7].value)) &&
                        <Box sx={{ width: 180 }}>
                            <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.zoning && propertySummary.zoning.text ?
                                    propertySummary.zoning.subtitle :
                                    propertySummaryState && propertySummaryState[7] ?
                                        propertySummaryState[7].label :
                                        ''}
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                {propertySummary && propertySummary.zoning.text ?
                                    propertySummary.zoning.text :
                                    propertySummaryState && propertySummaryState[7].value ?
                                        propertySummaryState[7].value :
                                        ''}
                            </Typography>
                        </Box>
                    }
                </Box> */}

{/* <Box className='flex flex-row justify-between mt-5'>
                    {propertySummary && propertySummary.others.length > 0
                        &&
                        propertySummary.others.slice(0, 3).map((item, idx) =>
                            <Box key={idx} sx={{ width: 180 }}>
                                <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.text}
                                </Typography>
                            </Box>
                        )}
                </Box>
                <Box className='flex flex-row justify-between mt-5'>
                    {propertySummary && propertySummary.others.length > 3
                        &&
                        propertySummary.others.slice(3, 6).map((item, idx) =>
                            <Box key={idx} sx={{ width: 180 }}>
                                <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.text}
                                </Typography>
                            </Box>
                        )}
                </Box>
                <Box className='flex flex-row justify-between mt-5'>
                    {propertySummary && propertySummary.others.length > 6
                        &&
                        propertySummary.others.slice(6, 9).map((item, idx) =>
                            <Box key={idx} sx={{ width: 180 }}>
                                <Typography variant='subtitle2' sx={{ color: "#d4d4d4", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant='subtitle2' sx={{ color: "#64748b", fontWeight: 600, fontFamily: "Poppins" }}>
                                    {item.text}
                                </Typography>
                            </Box>
                        )}
                </Box> */}