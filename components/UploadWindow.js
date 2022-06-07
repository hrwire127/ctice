import React, { useEffect, useRef, useState } from 'react'
import
{
    Paper, Typography, Box,
    CssBaseline, Divider, IconButton
} from '@mui/material'
import { Close, Save } from '@mui/icons-material';
import useStyles from '../assets/styles/_UploadWind';
import SelectionsList from './SelectionsList'
import GalleryList from "./GalleryList"
import UploadProfileWind from './UploadProfileWind'

const drawerWidth = 280;

function UploadWindow(props)
{
    const { setOpen, profile, windowAlert, image, setImage, setGallery, gallery, galleryDelete } = props

    const selections = [
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_1,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_2,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_3,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_4,
    ]

    const classes = useStyles(props)();

    useEffect(() =>
    {
        const main = document.querySelector(".cover")
        main.style.position = "absolute"
        main.style.zIndex = 2
        main.style.background = "rgba(255, 255, 255, 0.2)"
        main.style.backdropFilter = "blur(8px)"
        main.style.height = "100vh"
        main.style.width = "100vw"

        return () =>
        {
            main.style = null
        }
    }, [])

    const handleSubmit = () =>
    {

    }

    const onWindowClick = () =>
    {
        setOpen(false)
        const main = document.querySelector(".cover")
        main.style = null
    }

    return (
        <Paper
            elevation={12}
            className={classes.Window}
        >
            <Box sx={{ display: 'flex', height: "100%" }}>
                <CssBaseline />
                <Box
                    position="fixed"
                    sx={{
                        width: `100%`,
                        display: "flex",
                        justifyContent: "right"
                    }}
                >
                    <IconButton onClick={handleSubmit}>
                        <Save color="primary"/>
                    </IconButton>
                    <IconButton onClick={onWindowClick}>
                        <Close />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        width: drawerWidth,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <UploadProfileWind
                        windowAlert={windowAlert}
                        setImage={setImage}
                        image={image}
                        setGallery={setGallery}
                        gallery={gallery}
                    />
                </Box>
                <Box
                    component="main"
                    className={classes.Main}
                >
                    <Typography variant="h5" color="primary" textAlign="center" sx={{ mt: 3 }}>
                        Gallery
                    </Typography>
                    <GalleryList galleryDelete={galleryDelete} gallery={gallery} image={image} setImage={setImage} setGallery={setGallery} />
                    <Divider />
                    <Typography variant="h5" color="primary" textAlign="center">
                        Selections
                    </Typography>
                    <SelectionsList selections={selections} image={image} setImage={setImage} />
                </Box>
            </Box>
        </Paper >
    )
}

export default UploadWindow