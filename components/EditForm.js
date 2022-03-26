import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Article, Clear } from '@mui/icons-material';
import Link from 'next/link';
import useFormError from './hooks/useFormError';
import TextArea from './TextArea'
import { makeStyles } from '@mui/styles';
import { uploadFile, deleteFile } from '../utils/commonFunc';


const useStyles = makeStyles({
    Container: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    Form: {
        mt: 1,
        width: "100%"
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
        marginTop: 8
    }
})

const theme = createTheme();

function EditForm(props)
{
    const [TitleError, setTitleError, helperTitleText, setHelperTitleText, checkTitleKey, setTitleTrue, setTitleFalse, titleValid] = useFormError(false)
    const [DescError, setDescError, helperDescText, setHelperDescText, checkDescKey, setDescTrue, setDescFalse, descValid] = useFormError(false)

    const { declaration, handleSubmit, setData, editorState } = props;
    const { title, description, _id } = declaration;

    const [file, changeFile] = useState(declaration.file);

    console.log(file)

    const classes = useStyles();

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (file)
        {
            // file === declaration.file ? {} : 
            data.append("file", file)
        }
        else
        {
            data.delete("file")
        }
        data.append("description", JSON.stringify(editorState))

        const title_ = data.get('title');
        const description_ = editorState.blocks[0].text;

        console.log(file)

        if (titleValid(title_) && descValid(description_)) //add editor state
        {
            setTitleTrue()
            setDescTrue()
            handleSubmit(data)
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
                        Edit {title}
                    </Typography>
                    <Box component="form" error={TitleError} onSubmit={errCheck} noValidate className={classes.Form}>
                        <TextField
                            margin="normal"
                            maxLength="10"
                            required
                            error={TitleError}
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            autoComplete="title"
                            onKeyPress={checkTitleKey}
                            autoFocus
                            defaultValue={title}
                        />
                        <FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>

                        <TextArea
                            setData={setData}
                            error={DescError}
                            checkDescKey={checkDescKey}
                            data={JSON.parse(description)}
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
                            Finish
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

export default EditForm;
