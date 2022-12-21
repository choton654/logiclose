import React from 'react'
import SideNavbar from "./SideNavbar"
import { Box, Modal, Fade, Backdrop, Typography, Button } from "@mui/material"
import { logicloseState, setQueryPassMatched } from "../../features/logicloseSlice"
import { useDispatch, useSelector } from "react-redux"
import Navbar from './Navbar'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const LogiCLoseWebLayout = ({ children, title, sharedUrl,
    randomPass, queryToken, editUrl }) => {

    const router = useRouter()
    const { isDrawerExpand, queryPassMatched } = useSelector(store => logicloseState(store))
    const dispatch = useDispatch()
    const [queryPass, setQueryPass] = useState(null)
    const [inputPass, setInputPass] = useState('')
    const [passError, setPassError] = useState(false)

    useEffect(() => {
        if (queryToken && queryToken.split('____')[1]) {
            setQueryPass(router.query.token.split('____')[1])
        }

    }, [router.query])

    if (queryToken && !queryPassMatched) {
        return (
            <Box>
                <div
                    className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
                >
                    <div
                        className="
          flex flex-col
          bg-white
          shadow-md
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          py-8
          rounded-3xl
          w-50
          max-w-md
        "
                    >
                        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
                            Check for password
                        </div>
                        <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
                            Enter your credentials to get access account
                        </div>

                        <div className="mt-10">
                            <div className="flex flex-col mb-6">
                                <label
                                    for="password"
                                    className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                                >Password:</label
                                >
                                <div className="relative">
                                    <div
                                        className="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                                    >
                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={inputPass}
                                        onChange={(e) => {
                                            setInputPass(e.target.value)
                                            setPassError(false)
                                        }}
                                        className="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>
                            {passError && <Typography variant='subtitle2' sx={{
                                fontFamily: "Poppins", mb: 3,
                                fontSize: 12, fontWeight: "600"
                            }} color={'red'}>Wrong password</Typography>}
                            <div className="flex w-full">
                                <button
                                    type="submit"
                                    className="
                  flex
                  mt-2
                  items-center
                  justify-center
                  focus:outline-none
                  text-white text-sm
                  sm:text-base
                  bg-blue-500
                  hover:bg-blue-600
                  rounded-2xl
                  py-2
                  w-full
                  transition
                  duration-150
                  ease-in
                "
                                    onClick={() => {
                                        if (inputPass === queryPass) {
                                            dispatch(setQueryPassMatched())
                                        } else {
                                            setPassError(true)
                                        }
                                    }} >
                                    <span className="mr-2 uppercase">Check</span>
                                    <span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        )
    }

    return (
        <Box className='flex flex-row bg-[#fff] w-full'>
            <SideNavbar queryToken={queryToken} sharedUrl={sharedUrl} />
            <Box className={`flex flex-col w-[${isDrawerExpand ? '80%' : '95%'}] 
            ml-[${isDrawerExpand ? '20%' : '5%'}] mt-[5%] bg-[#fff] ${!isDrawerExpand && 'duration-500'}`}>
                <Box className={`fixed duration-500 z-30 top-0 left-[${isDrawerExpand ? '20%' : '5%'}] 
                w-[${isDrawerExpand ? '80%' : '95%'}]`} >
                    <Navbar title={title} sharedUrl={sharedUrl} randomPass={randomPass} editUrl={editUrl} />
                </Box>
                <Box className={`duration-500 bg-[#fff]`}>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default LogiCLoseWebLayout


 // <Box>
        //     <SideNavbar title={title} />
        //     <Box className={`pl-[${state.isDrawerExpand ? '20%' : '5%'}] pt-[5%] duration-500 bg-[#fff]`}>
        //         {children}
        //     </Box>
        // </Box>