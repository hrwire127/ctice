import React, { useRef, useState } from 'react'
import { Paper, Box } from '@mui/material'
import { Add } from "@mui/icons-material"

function GalleryUpload(props)
{
    const { setGalleryFiles, gallery } = props

    const inputFileRef = useRef(null);

    const onUpload = () =>
    {
        inputFileRef.current.click();
    }

    return (<Paper
        variant="outlined"
        onClick={onUpload}
        sx={{
            width: 100,
            height: 100,
            "&:hover": {
                cursor: "pointer",
                borderWidth: 2,
                "& svg": {
                    fontSize: 30
                }
            },
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
        }}>
        <Add />
        <input
            type="file"
            id="profile"
            name="profile"
            ref={inputFileRef}
            multiple
            onChange={(e) => 
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