import React from 'react'
import { Box } from '@mui/material'
import useStyles from '../assets/styles/_SelectionsList'
import GalleryCard from './GalleryCard'
import GalleryUpload from './GalleryUpload'

function GalleryList(props)
{
    const { gallery, setGallery, image, setImage, galleryDelete } = props

    const classes = useStyles(props)()

    return (
        <Box className={classes.SelectionsFull}>
            <Box className={classes.SelectionsGrid}>
                <GalleryUpload setGallery={setGallery} gallery={gallery} />
                {gallery.map((p, i) => <GalleryCard key={i} setImage={setImage} image={p} checked={image === p ? true : false} galleryDelete={galleryDelete}/>)}
            </Box>
        </Box>
    )
}

export default GalleryList