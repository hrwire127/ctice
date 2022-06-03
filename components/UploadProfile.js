import React, { useRef } from 'react'
import
{
    Avatar, Button, CssBaseline,
    TextField, FormControlLabel, Checkbox,
    Grid, Box, Typography, Container, Alert,
    FormHelperText, Link, Paper
} from '@mui/material';
import { CheckCircle, FileUpload, Close } from '@mui/icons-material';
import { uploadFileUrl } from "../utilsCS/_basic";

function UploadIconProfile(props)
{
    const { profile, image, setImage } = props;

    const inputFileRef = useRef(null);

    const onBtnClick = () =>
    {
        if (image)
        {
            setImage()
            inputFileRef.current.value = ''
        }
        else  
        {
            inputFileRef.current.click();
        }
    }


    return (<Box
        onClick={onBtnClick}
        sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
                cursor: "pointer",
                "& div": {
                    background: `linear-gradient(to top, rgb(0 0 0 / 71%), rgb(0 0 0 / 71%)), url(${image === profile ? image : (image ? URL.createObjectURL(image) : process.env.NEXT_PUBLIC_DEF_PROFILE_URL)}) no-repeat center`,
                },
                "& svg": {
                    top: "30%",
                }
            },
            "& div": {
                width: 200,
                height: 200,
                background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${image === profile ? image : (image ? URL.createObjectURL(image) : process.env.NEXT_PUBLIC_DEF_PROFILE_URL)}) no-repeat center`,
                backgroundSize: "cover",
                borderRadius: 4,
                borderColor: "primary.main",
                boxShadow: "0px 0px 5px 0px",
                transition: "background 1s cubic-bezier(0.72, 1.34, 1, 1)",
            },
            position: "relative"
        }}
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
                setImage(e.target.files[0])
            }}
            hidden
            accept="image/png, image/jpg, image/jpeg"
        />
        {image
            ? (<Close
                color="primary"
                sx={{
                    fontSize: 90,
                    position: "absolute",
                    top: "50%",
                    transition: "top 0.1s cubic-bezier(0.72, 1.34, 1, 1)",
                    transform: "translate(0, -50%)"
                }}

            />)
            : (
                <FileUpload
                    color="primary"
                    sx={{
                        fontSize: 90,
                        position: "absolute",
                        top: "50%",
                        transition: "top 0.1s cubic-bezier(0.72, 1.34, 1, 1)",
                        transform: "translate(0, -50%)"
                    }}
                />)
        }

    </Box>)
}


export default UploadIconProfile
