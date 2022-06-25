import React from 'react'
import { Paper, IconButton } from '@mui/material'
import { Check, Delete, Circle } from '@mui/icons-material'

function GalleryCard(props)
{
    const { checked, image, setImage, galleryDelete } = props

    const preparedImg = image
        ? (image.content ? URL.createObjectURL(image.content) : process.env.NEXT_PUBLIC_DEF_PROFILE_URL)
        : process.env.NEXT_PUBLIC_DEF_PROFILE_URL


    return checked
        ? (<Paper
            sx={{
                width: 100,
                height: 100,
                position: "relative",
                "& div": {
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${preparedImg}) no-repeat center`,
                    backgroundSize: "cover",
                    borderRadius: 1,
                    borderColor: "primary.main",
                    boxShadow: "0px 0px 5px 0px",
                },
            }}>
            <div
                alt="Picture"
            />
            <Check
                color="primary"
                sx={{
                    fontSize: 90,
                    position: "absolute",
                    top: "0%",
                    left: "6%"
                }} />
            <IconButton
                onClick={() => galleryDelete(image)}
            >
                <Delete />
            </IconButton>
        </Paper>)
        : (<Paper
            sx={{
                width: 100,
                height: 100,
                "&:hover": {
                    cursor: "pointer",
                    "& div": {
                        background: `linear-gradient(rgb(0 0 0 / 71%), rgb(0 0 0 / 71%)), url(${preparedImg}) no-repeat center`,
                        backgroundSize: "cover",
                    }
                },
                "& div": {
                    width: "100%",
                    height: "100%",
                    background: `url(${preparedImg}) no-repeat center`,
                    backgroundSize: "cover",
                    borderRadius: 1,
                    borderColor: "primary.main",
                    boxShadow: "0px 0px 5px 0px",
                },
            }}>
            <div
                onClick={() => setImage(image.content)}
                alt="Picture"
            />
            <IconButton
                onClick={() => galleryDelete(image)}
            >
                <Delete />
            </IconButton>
        </Paper >)
}

export default GalleryCard