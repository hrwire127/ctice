import React, { useRef } from 'react'
import { Box, Button } from '@mui/material'
import useStyles from '../assets/styles/_UploadWindow'

function UploadContainer(props)
{
    const { setImage, image,
        setGalleryFiles, gallery, } = props

    const inputFileRef = useRef(null);
    const classes = useStyles(props)()
    const isDisabled = !image || typeof image === 'string' || gallery.filter(e => e.name === image.name).length > 0

    const onUpload = () =>
    {
        inputFileRef.current.click();
    }

    const onDelete = () =>
    {
        setImage()
        inputFileRef.current.value = ''
    }

    const onAdd = () =>
    {
        if (typeof image !== 'string')
        {
            setGalleryFiles([image])
        }
    }

    return (
        <Box className={classes.Upload}>
            <Button
                color="success"
                variant="contained"
                disabled={isDisabled}
                onClick={onAdd}
                sx={{ mb: 2 }}
            >
                Add
            </Button>
            <Box className={classes.Profile}>
                <img
                    src={image ? image : "/images/def-profile.jpg"}
                    crossOrigin="anonymous"
                    alt="Picture"
                />
                <input
                    type="file"
                    id="profile"
                    name="profile"
                    ref={inputFileRef}
                    onInput={(e) => 
                    {
                        setImage(e.target.files[0])
                    }}
                    hidden
                    accept="image/png, image/jpg, image/jpeg"
                />
            </Box>
            <Box className={classes.Actions}>
                <Button
                    variant="contained"
                    onClick={onUpload}
                >
                    Upload
                </Button>
                <Button
                    variant="text"
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </Box>
        </Box >
    )
}

export default UploadContainer