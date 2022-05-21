import React from 'react'
import { Button, Box, IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { uploadFile } from "../utilsCS/_client";
import useStyles from "../assets/styles/_UploadBtn"

function UploadBtnProfile(props)
{
    const { changeFile, file } = props;
    const classes = useStyles();

    return (
        <Box className={classes.Upload}>
            <Button
                variant="outlined"
                className={classes.UploadBtn}
                component="label"
            >
                {file
                    ? file.name
                    : "Upload Avatar"}
                <input
                    type="file"
                    id="profile"
                    name="profile"
                    onChange={(e) => uploadFile(e.target.files[0], changeFile)}
                    hidden
                    accept="image/png, image/jpg, image/jpeg"
                />
            </Button>

            <IconButton
                onClick={() => changeFile()}
            >
                <Clear color="tertiary" />
            </IconButton>
        </Box>
    )
}

export default UploadBtnProfile