import React from 'react';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, Typography, Menu, Divider } from '@mui/material';
import { logiCloseSlice, logicloseState } from "../features/logicloseSlice"
import { useDispatch, useSelector } from 'react-redux';

const MenuSelect = ({ setNoOfTextFields, setNoOfInputFields, setisImageFieldAdded }) => {

    const dispatch = useDispatch()
    const { closeMenu } = logiCloseSlice.actions
    const { customize } = useSelector(logicloseState)

    return (
        <Menu
            id="basic-menu"
            anchorEl={customize}
            open={Boolean(customize)}
            onClose={() => dispatch(closeMenu())}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        >
            <Box sx={{ py: 1, px: 2, display: "flex", flexDirection: "column" }}>
                <Typography sx={{
                    color: "#469BD3", fontFamily: "Roboto",
                    fontSize: 16, fontWeight: "500"
                }}>Add New Widgets
                </Typography>
                <Divider sx={{ mt: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box sx={{
                            display: "flex", justifyContent: "center", alignItems: "center",
                            height: 80, width: 100, borderRadius: 1, cursor: "pointer",
                            backgroundColor: "#EFF7FF", flexDirection: "column"
                        }} onClick={() => {
                            setNoOfInputFields(prev => [...prev, { sortDescription: '' }])
                            dispatch(closeMenu())
                        }}>
                            <Box sx={{
                                position: "relative",
                                width: 30, height: 24, borderRadius: 1, borderWidth: 3,
                                borderColor: "#469BD3"
                            }} >
                                <Box sx={{
                                    position: "absolute", bottom: -8, right: -9,
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    width: 15, height: 15, backgroundColor: "#EFF7FF"
                                }}>
                                    <Typography sx={{ fontFamily: "Arvo", color: "#469BD3", fontSize: 12 }}>A</Typography>
                                </Box>
                            </Box>
                            <Typography sx={{
                                fontFamily: "Roboto", color: "#469BD3", fontWeight: "500",
                                fontSize: 13, mt: 1
                            }}>Input</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex", justifyContent: "center",
                            alignItems: "center", height: 80, width: 100,
                            borderRadius: 1, backgroundColor: "#EFF7FF", ml: 2,
                            flexDirection: "column", cursor: "pointer"
                        }} onClick={() => {
                            setisImageFieldAdded(true)
                            dispatch(closeMenu())
                        }}>
                            <Box sx={{
                                position: "relative",
                                width: 30, height: 24, borderRadius: 1, borderWidth: 3,
                                borderColor: "#469BD3"
                            }} >
                                <Box sx={{
                                    position: "absolute", bottom: -8, right: -9,
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    width: 15, height: 14, backgroundColor: "#EFF7FF"
                                }}>
                                    <FileUploadOutlinedIcon
                                        sx={{ width: 12, height: 12, color: "#469BD3" }}
                                    />
                                </Box>
                            </Box>
                            <Typography sx={{
                                fontFamily: "Roboto", color: "#469BD3", fontWeight: "500",
                                fontSize: 13, mt: 1
                            }}>Image</Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: "flex", justifyContent: "center",
                        alignItems: "center", flexDirection: "column",
                        mt: 2, height: 80, width: 215, cursor: "pointer",
                        borderRadius: 1, backgroundColor: "#EFF7FF",
                    }} onClick={() => {
                        setNoOfTextFields(prev => [...prev, { description: '' }])
                        dispatch(closeMenu())
                    }}>
                        <Box sx={{
                            position: "relative",
                            width: 30, height: 24, borderRadius: 1, borderWidth: 3,
                            borderColor: "#469BD3"
                        }} >
                            <Box sx={{
                                position: "absolute", bottom: -8, right: -9,
                                display: "flex", justifyContent: "center", alignItems: "center",
                                width: 15, height: 15, backgroundColor: "#EFF7FF"
                            }}>

                            </Box>
                        </Box>
                        <Typography sx={{
                            fontFamily: "Roboto", color: "#469BD3", fontWeight: "500",
                            fontSize: 13, mt: 1
                        }}>Text Area</Typography>
                    </Box>
                </Box>
            </Box>
        </Menu>
    );
}

export default MenuSelect;
