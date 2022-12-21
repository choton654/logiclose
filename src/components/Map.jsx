import React, { useCallback, useEffect, useState } from "react";
import {
    Box, Typography, Fade, Modal, Backdrop, Button
} from '@mui/material';
import GooglePlacesAutocomplete, { geocodeByAddress, geocodeByLatLng, getLatLng, geocodeByPlaceId } from 'react-google-places-autocomplete';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
const GOOGLE_MAP_API_KEY = ''

const MyMapComponent = withScriptjs(withGoogleMap(({ coords, latlng, setLatLng, getAddressFromLatlng }) => {

    return (
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{
                lat: latlng ? latlng.lat : coords?.latitude,
                lng: latlng ? latlng.lng : coords?.longitude
            }}
            zoom={8}
            center={{
                lat: latlng ? latlng.lat : coords?.latitude,
                lng: latlng ? latlng.lng : coords?.longitude
            }}

        >
            <Marker
                draggable
                onDragEnd={async (e) => {
                    setLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                    await getAddressFromLatlng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
                }}
                position={{
                    lat: latlng ? latlng.lat : coords?.latitude,
                    lng: latlng ? latlng.lng : coords?.longitude
                }}
                labelAnchor={new google.maps.Point(0, 0)}
                cursor="pointer"
            />
        </GoogleMap>)
}))

const Map = ({ coords, fieldIndex, handleChange, mapOpen, handleMapClose }) => {

    const [value, setValue] = useState(null);
    const [latlng, setLatLng] = useState(null)
    const [address, setAddress] = useState('')
    const getAddressFromLatlng = useCallback(async ({ lat, lng }) => {
        try {
            const results = await geocodeByLatLng({ lat, lng })
            handleChange(fieldIndex, results[0].formatted_address)
            setAddress(results[0].formatted_address)
        } catch (error) {
            console.log('error', error);
        }
    }, [handleChange, fieldIndex])

    useEffect(() => {
        if (value) {
            (async () => {
                try {
                    const results = await geocodeByPlaceId(value.value.place_id)
                    const { lat, lng } = await getLatLng(results[0])
                    setLatLng({ lat, lng })
                    handleChange(fieldIndex, results[0].formatted_address)
                    setAddress(results[0].formatted_address)
                } catch (error) {
                    console.log('geocode error', error);
                }
            })()
        }
    }, [value])

    return <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={mapOpen}
        onClose={handleMapClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
    >
        <Fade in={mapOpen}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                height: 700,
                bgcolor: 'background.paper',
                // border: '2px solid #000',
                boxShadow: 24,
                p: 2,
            }}>
                <GooglePlacesAutocomplete
                    apiKey={GOOGLE_MAP_API_KEY}
                    selectProps={{
                        value,
                        onChange: setValue,
                    }}
                />
                <MyMapComponent googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initMap&v=weekly&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: '100%', width: '100%' }} />}
                    containerElement={<div style={{ height: `500px`, marginTop: 10 }} />}
                    mapElement={<div style={{ height: '100%', width: '100%' }} />}
                    coords={coords} latlng={latlng} setLatLng={setLatLng}
                    getAddressFromLatlng={getAddressFromLatlng}
                />
                {address &&
                    <Typography id="transition-modal-title" variant="subtitle1"
                        component="h4" sx={{ mt: 1, fontFamily: "Poppins", textAlign: "center" }}>
                        Location: {address}
                    </Typography>
                }
                <Button
                    className='bg-[#469BD3]'
                    type="submit"
                    variant="contained"
                    sx={{
                        marginLeft: "40%",
                        letterSpacing: 1, mt: 2,
                        fontFamily: "Poppins", fontWeight: "600"
                    }}
                    onClick={handleMapClose}
                >
                    Close map
                </Button>
            </Box>
        </Fade>
    </Modal>
}

export default Map

