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
import useLoading from './hooks/useLoading'
import UploadProfileWind from './UploadProfileWind'
import CS_Redirects from '../utilsCS/CS_Redirects'

const drawerWidth = 280;

function UploadWindow(props)
{
    const { setOpen, profile, windowAlert, setWindowAlert, image, setImage, setGallery, gallery, galleryDelete } = props

    const selections = [
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_1,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_2,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_3,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_4,

    ]
    const [submitWhile, submitSwitch] = useLoading(false)

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

    const handleSubmit = async () =>
    {
        const body = new FormData()

        submitWhile(async () =>
        {
            for (let f of gallery)
            {
                body.set(f.name, f.content)
            }
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/gallery`, {
                method: 'POST',
                body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.err) setWindowAlert(res.err.message)
                    // CS_Redirects.tryResCS(res, window)
                })
        })
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
                    {submitSwitch(2, () => (
                        <>
                            <IconButton onClick={handleSubmit}>
                                <Save color="primary" />
                            </IconButton>
                            <IconButton onClick={onWindowClick}>
                                <Close />
                            </IconButton>
                        </>
                    ))}
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