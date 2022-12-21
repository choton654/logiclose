import React, { useState } from 'react'
import { AppBar, Avatar, Toolbar, Typography, Box, IconButton, Menu, Fade, MenuItem, Button } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import MenuIcon from '@mui/icons-material/Menu'
import { logicloseState, toggleDrawer } from "../../features/logicloseSlice"
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { clearData, getData } from '../../utils/localStorage'
import { useGetUserQuery } from '../../services/query'

const Navbar = ({ title, sharedUrl, randomPass, editUrl }) => {

    const dispatch = useDispatch()
    const { queryPassMatched } = useSelector(store => logicloseState(store))
    const token = getData('token')
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { data: userData, isLoading: getting, error } = useGetUserQuery(token)

    const logOut = () => {
        clearData()
        router.push('/')
    }

    return <AppBar className='bg-[#f8fafc] h-[50] shadow' position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() =>
                    dispatch(toggleDrawer())}
            >
                <MenuIcon sx={{ color: "#424242" }} />
            </IconButton>
            <Typography className='text-slate-600' variant="h6" component="div"
                sx={{ flexGrow: 1, fontFamily: "Poppins" }}>
                {title}
            </Typography>
            {!queryPassMatched &&
                <Box className='flex flex-row items-center'>
                    <a
                        href={`mailto:?subject=Check this link &body=${sharedUrl} %0D%0A%0D%0A password:-${randomPass}`}>
                        <ShareIcon sx={{ color: "#469BD3", mr: 2 }} />
                    </a>
                    {router.pathname !== '/webView/mapComperison' &&
                        <Button
                            className='bg-[#469BD3]'
                            type="submit"
                            variant="contained"
                            size='small'
                            sx={{
                                marginLeft: "auto",
                                letterSpacing: 1, mr: 2,
                                fontFamily: "Poppins", fontWeight: "600"
                            }}
                            onClick={() => router.push(editUrl)}
                        >
                            Edit
                        </Button>
                    }
                    <Box onClick={handleClick} sx={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: 'pointer' }}>
                        <Avatar
                            alt="Remy Sharp"
                            src="https://images.unsplash.com/photo-1660228321829-5f90c6d94ac5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDd8dG93SlpGc2twR2d8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
                            sx={{ width: 35, height: 35, my: 2 }}
                        />
                        <Typography variant='subtitle2'
                            sx={{ fontFamily: "Poppins", color: "#bdbdbd", textAlign: "left", mx: 2 }}>
                            {userData !== undefined ? userData.name : 'Jhon Smith'}
                        </Typography>
                    </Box>
                </Box>
            }
        </Toolbar>
        <Menu
            id="fade-menu"
            MenuListProps={{ 'aria-labelledby': 'fade-button' }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
        >
            {/* <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/executiveSummary/investmentSummary')
                    handleClose()
                }}>Executive Summary</MenuItem>
            <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/propertyDescription/propertySummary')
                    handleClose()
                }}>Property Summary</MenuItem>
            <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/locationOverView/locationSummary')
                    handleClose()
                }}>Location Overview</MenuItem>
            <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/financialSummary/sourceFund')
                    handleClose()
                }}>Financial Summary</MenuItem>
            <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/exitScenarios/saleScenario')
                    handleClose()
                }}>Exit Scenarios</MenuItem>
            <MenuItem sx={{ flexGrow: 1, fontFamily: "Poppins" }}
                onClick={() => {
                    router.push('/about')
                    handleClose()
                }}>About</MenuItem> */}
            <MenuItem onClick={logOut} className='bg-[#469BD3] text-[#fff] hover:text-[#469BD3]'>
                <Typography className='hover:text-[#469BD3]' sx={{ flexGrow: 1, fontFamily: "Poppins" }}>
                    Log out
                </Typography>
            </MenuItem>
        </Menu>
    </AppBar>
}

export default Navbar