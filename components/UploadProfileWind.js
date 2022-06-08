import React, { useRef } from 'react'
import { CheckCircle, FileUpload, Close } from '@mui/icons-material';
import
{
    Paper, Typography, Box, ButtonTypeMap,
    Drawer, CssBaseline, AppBar, Toolbar, List, Divider,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    InboxIcon, MailIcon, Button, IconButton
} from '@mui/material'
import useStyles from '../assets/styles/_WindowUpload'
import TransitionAlerts from './TransitionAlerts'

function UploadProfileWind(props)
{
    const { setImage, image, setGallery, gallery, windowAlert, setWindowAlert } = props

    const inputFileRef = useRef(null);
    const classes = useStyles(props)()

    const onUpload = () =>
    {
        inputFileRef.current.click();
    }

    const onDelete = () =>
    {
        setImage()
        inputFileRef.current.value = ''
    }

    return (
        <Box className={classes.Upload}>
            {windowAlert && (<TransitionAlerts type="error" setFlash={setWindowAlert}>{windowAlert}</TransitionAlerts>)}
            <Button
                color="success"
                variant="contained"
                disabled={!image || typeof image === 'string' || gallery.filter(e => e.name === image.name).length > 0}
                onClick={() => 
                {
                    if (typeof image !== 'string')
                    {
                        setGallery([image])
                    }
                }
                }
                sx={{ mb: 2 }}
            >
                Add
            </Button>
            <Box className={classes.Profile}>
                <div
                    alt="Picture"
                />
                <input
                    type="file"
                    id="profile"
                    name="profile"
                    ref={inputFileRef}
                    onChange={(e) => 
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

export default UploadProfileWind