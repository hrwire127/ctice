import React from 'react'
import { Button, Box, IconButton } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { uploadFile } from "../utils/clientFunc";
import useStyles from "../assets/styles/_UploadBtn"

function UploadBtn(props)
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
                    : "Upload Pdf"}
                <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={(e) => uploadFile(e, changeFile)}
                    hidden
                    accept="application/pdf"
                />
            </Button>

            <IconButton
                onClick={() =>changeFile()}
            >
                <Clear />
            </IconButton>
        </Box>
    )
}

export default UploadBtn