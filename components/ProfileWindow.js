import React, { useEffect, useRef, useState } from 'react'
import
{
    Paper, Typography, Box,
    CssBaseline, Divider, IconButton
} from '@mui/material'
import { Close, Save } from '@mui/icons-material';
import useStyles from '../assets/styles/_ProfileWindow';
import SelectionsList from './SelectionsList'
import GalleryList from "./GalleryList"
import useLoading from './hooks/useLoading'
import UploadWindow from './UploadWindow'
import TransitionAlerts from './TransitionAlerts'
import useAlertMsg from './hooks/useAlertMsg';

function ProfileWindow(props)
{
    const { setOpen, image, setImage } = props

    const [setWindowAlertMsg, windowAlert, setWindowAlert] = useAlertMsg()
    const [gallery, setGallery] = useState([])

    const [submitWhile, submitSwitch] = useLoading(false)

    const classes = useStyles(props)()

    const selections = [
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_1,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_2,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_3,
        process.env.NEXT_PUBLIC_DEF_PROFILE_URL_4,
    ]

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
            const main = document.querySelector(".cover")
            main.style = null
            main.style = null
        }
    }, [])

    const setGalleryFiles = (files) =>
    {
        let newGallery = []
        Array.from(files).forEach(i =>
        {
            let exists = null;
            gallery.forEach(f =>
            {
                if (f.name === i.name)
                {
                    exists = true
                }
            })
            if (!exists)
            {
                newGallery.push({ content: i, name: i.name })
            }
            else
            {
                setWindowAlertMsg(`[${i.name}] exists`, 'error')
                return
            }
        })
        setGallery(gallery.concat(newGallery))
    }

    const galleryDelete = (i) =>
    {
        const index = gallery.findIndex(f => f.name === i.name)
        const newGallery = [...gallery]
        newGallery.splice(index, 1)
        setGallery(newGallery)
    }

    const handleSubmit = async () =>
    {
        const body = new FormData()

        for (let f of gallery)
        {
            body.set(f.name, f.content)
        }

        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/gallery`, {
                method: 'POST',
                body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) setWindowAlertMsg(res.error.message, "error")
                })
        })
    }


    return (
        <Paper
            elevation={12}
            className={classes.Window}
        >
            {windowAlert && (<TransitionAlerts type={windowAlert.type} setFlash={setWindowAlert}>{windowAlert.message}</TransitionAlerts>)}
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
                    {submitSwitch(1, () => (
                        <>
                            <IconButton onClick={handleSubmit}>
                                <Save color="primary" />
                            </IconButton>
                            <IconButton onClick={() => setOpen(false)}>
                                <Close />
                            </IconButton>
                        </>
                    ))}
                </Box>
                <Box
                    sx={{
                        width: theme => theme.windowDrawerWidth,
                        '& .MuiDrawer-paper': {
                            width: theme => theme.windowDrawerWidth,
                            boxSizing: 'border-box',
                        },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <UploadWindow
                        setWindowAlert={setWindowAlert}
                        setImage={setImage}
                        setGalleryFiles={setGalleryFiles}
                        windowAlert={windowAlert}
                        image={image}
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
                    <GalleryList galleryDelete={galleryDelete} gallery={gallery} image={image} setImage={setImage} setGalleryFiles={setGalleryFiles} />
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

export default ProfileWindow