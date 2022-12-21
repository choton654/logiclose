import React, { useEffect, useState } from 'react';
import Head from "next/head"
import { CssBaseline, Paper, Box, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from './Logo';

const theme = createTheme();

const AuthLayout = ({ children, dimension, isPass, resetPass }) => {

    return (
        <div>
            <Head>
                <title>LOGICLOSE</title>
                <meta name="description" content="LOGICLOSE CLOSING CONCIERGE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={6}
                        sx={{
                            backgroundImage: `url(${resetPass ? 'https://res.cloudinary.com/toton007/image/upload/v1652075890/Rectangle_850_dpo40h.png' :
                                isPass ? 'https://res.cloudinary.com/toton007/image/upload/v1652074778/Rectangle_850_ghc4vu.png' :
                                    'https://res.cloudinary.com/toton007/image/upload/v1651947119/Rectangle_850_w7zpmw.png'
                                })`,
                            backgroundColor: "#bfdbfe",
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    ></Grid>
                    {dimension && dimension.innerWidth >= 900 &&
                        <Box sx={{ position: "absolute", top: 50, left: "10%", background: "none" }}>
                            <Logo isPass={isPass} />
                        </Box>
                    }
                    <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                        {children}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default AuthLayout