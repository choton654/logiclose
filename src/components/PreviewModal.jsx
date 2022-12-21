import React from 'react'
import { Backdrop, Box, Fade, Modal } from '@mui/material'
import Image from "next/image"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';


const PreviewModal = ({ wrapperComponent, open, handleClose, imgSrc }) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    bgcolor: 'background.paper',
                    // border: '2px solid #000',
                    boxShadow: 24,
                    cursor: "pointer"
                }}>
                    {wrapperComponent !== undefined ?
                        wrapperComponent()
                        :
                        <Image
                            src={imgSrc}
                            style={{
                                borderRadius: 5
                            }}
                            alt="no image"
                        />
                    }
                    <Box sx={{ position: "absolute", top: -40, right: '45%' }}>
                        <CancelOutlinedIcon sx={{
                            color: "#fff", border: 'none',
                            width: 35, height: 35, cursor: "pointer"
                        }}
                            onClick={() => handleClose()} />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default PreviewModal