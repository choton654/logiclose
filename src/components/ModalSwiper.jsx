import { Backdrop, Box, Fade, Modal } from '@mui/material'
import React from 'react'
import { FreeMode, Navigation, Thumbs } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

const ModalSwiper = ({ open, handleClose, imgArr }) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    // bgcolor: 'background.paper',
                    // border: '2px solid #000',
                    // boxShadow: 24,
                    cursor: "pointer"
                }}>
                    <Swiper
                        style={{
                            "--swiper-navigation-color": "#fff",
                            "--swiper-pagination-color": "#469BD3",
                            height: '80vh',
                            width: '100%',
                        }}
                        spaceBetween={8}
                        navigation={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="cursor-pointer"
                    >
                        {imgArr.map((imgsrc, imgidx) =>
                            <SwiperSlide key={imgidx}>
                                <img
                                    src={imgsrc}
                                    style={{
                                        display: 'block', objectFit: 'contain',
                                        height: '100%', width: '100%'
                                    }}
                                    alt={`img${imgidx}`}
                                />
                            </SwiperSlide>
                        )}
                    </Swiper>
                </Box>
            </Fade>
        </Modal>
    )
}

export default ModalSwiper