import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Article, Clear } from '@mui/icons-material';
import useFormError from './hooks/useFormError';
import { makeStyles } from '@mui/styles';
import TextArea from './TextArea'
import Link from 'next/link';
import { uploadFile, deleteFile } from '../utils/commonFunc';


const useStyles = makeStyles({
    Container: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    Form: {
        width: "100%",
        marginTop: 8
    },
    UploadBtn: {
        borderColor: "rgb(175, 175, 175)",
        color: "rgb(30, 30, 30)",
        flex: 1,
        "&:hover":
        {
            borderColor: "black",
        },
    },
    Upload: {
        display: "flex",
        marginTop: 8,
    }
});

const theme = createTheme();

export default function CreateForm(props)
{
    const [TitleError, setTitleError, helperTitleText, setHelperTitleText, checkTitleKey, setTitleTrue, setTitleFalse, titleValid] = useFormError(false)
    const [DescError, setDescError, helperDescText, setHelperDescText, checkDescKey, setDescTrue, setDescFalse, descValid] = useFormError(false)

    const [file, changeFile] = useState();
    const [editorState, setEditorState] = useState();


    const { handleSubmit } = props;

    const classes = useStyles();


    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        // data.append("file", JSON.stringify(file))
        // data.append("file", file)
        data.append("description", JSON.stringify(editorState))

        const title_ = data.get("title")
        const description_ = editorState.blocks[0].text;

        const valBody = JSON.stringify({
            title: title_,
            description: JSON.stringify(editorState),
        })

        if (titleValid(title_) && descValid(description_)) //add editor state
        {
            setTitleTrue()
            setDescTrue()
            handleSubmit(valBody, data)
        }
        else
        {
            if (!titleValid(title_)) { setTitleFalse() }
            if (!descValid(description_)) { setDescFalse() }
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box className={classes.Container}>
                    <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                        <Article />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Declaration
                    </Typography>
                    <Box component="form" enctype="multipart/form-data" onSubmit={errCheck} noValidate className={classes.Form}>
                        <TextField
                            margin="normal"
                            required
                            error={TitleError}
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            autoComplete="title"
                            onKeyPress={checkTitleKey}
                            autoFocus
                        />

                        <FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>
                        <TextArea
                            setData={setEditorState}
                            error={DescError}
                            checkDescKey={checkDescKey}
                        />

                        <FormHelperText error={DescError}>{helperDescText}</FormHelperText>

                        <Box className={classes.Upload}>
                            <Button
                                variant="outlined"
                                className={classes.UploadBtn}
                                component="label" //{ : ? " "} prop 
                            >
                                {file //{ : ? <> <>} component inside component 
                                    ? file.name //prop component
                                    : "Upload Pdf"
                                }
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={e => uploadFile(e, changeFile)}
                                    hidden
                                    accept="application/pdf"
                                />
                            </Button>

                            <IconButton
                                onClick={() =>
                                {
                                    deleteFile(changeFile)
                                }}>
                                <Clear />
                            </IconButton >
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                        <Link href="/">
                            Back
                        </Link>   

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}




