import React, { useRef } from 'react'
import { Box } from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import useStyles from '../assets/styles/_UploadProfile'

function UploadIcon(props)
{
    const { setImage, setOpen, noWindow } = props;

    const preparedImg = props.image
        ? (props.image.content ? URL.createObjectURL(props.image.content) : (props.image.type ? URL.createObjectURL(props.image) : props.image))
        : process.env.NEXT_PUBLIC_DEF_PROFILE_URL


    const inputFileRef = useRef(null);
    const classes = useStyles(props, preparedImg)()

    const onUpload = (e) =>
    {
        if (e.target.files[0]) setImage(e.target.files[0])
    }

    const Focus = () =>
    {
        if (noWindow)
        {
            inputFileRef.current.click()
        }
        else setOpen(true)
    }

    return (<Box
        onClick={Focus}
        className={classes.Profile}
    >
        <img
            src={preparedImg ? preparedImg : process.env.NEXT_PUBLIC_DEF_PROFILE_URL}
            crossOrigin="anonymous"
            alt="Picture"
        />
        <input
            type="file"
            id="profile"
            name="profile"
            ref={inputFileRef}
            onInput={onUpload}
            hidden
            accept="image/png, image/jpg, image/jpeg"
        />
        <FileUpload
            color="primary"
            className={classes.UploadBtn}
        />
    </Box>)
}

export default UploadIcon