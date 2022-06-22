import React, { useRef } from 'react'
import { Box } from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import useStyles from '../assets/styles/_UploadProfile'

function UploadProfile(props)
{
    const { setImage, setOpen, noWindow } = props;

    const preparedImg = props.image
        ? (props.image.content ? URL.createObjectURL(props.image.content) : (props.image.type ? URL.createObjectURL(props.image) : props.image))
        : process.env.NEXT_PUBLIC_DEF_PROFILE_URL


    const inputFileRef = useRef(null);
    const classes = useStyles(props, preparedImg)()

    return (<Box
        onClick={() =>
        {
            if (noWindow)
            {
                inputFileRef.current.click()
            }
            else setOpen(true)
        }}
        className={classes.Profile}
    >
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
                console.log(e.target.files[0])
                if (e.target.files[0]) setImage(e.target.files[0])
            }}
            hidden
            accept="image/png, image/jpg, image/jpeg"
        />
        <FileUpload
            color="primary"
            className={classes.UploadBtn}
        />
    </Box>)
}

export default UploadProfile