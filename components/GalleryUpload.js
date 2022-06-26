import React, { useRef, useState } from 'react'
import { Paper, Box } from '@mui/material'
import { Add } from "@mui/icons-material"
import useStyles from '../assets/styles/_GalleryUpload'

function GalleryUpload(props)
{
    const { setGalleryFiles, gallery } = props

    const inputFileRef = useRef(null);
    const classes = useStyles()

    const onUpload = () =>
    {
        inputFileRef.current.click();
    }

    return (<Paper
        variant="outlined"
        onClick={onUpload}
        className={classes.Upload}
    >
        <Add />
        <input
            type="file"
            id="profile"
            name="profile"
            ref={inputFileRef}
            multiple
            onInput={(e) => 
            {
                setGalleryFiles(e.target.files)
            }}
            hidden
            accept="image/png, image/jpg, image/jpeg"
        />
    </Paper>
    )
}

export default GalleryUpload