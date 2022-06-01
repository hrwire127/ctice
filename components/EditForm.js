import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TransitionAlerts from './TransitionAlerts'
import { Article, Clear } from '@mui/icons-material';
import { handleDeclrData } from "../utilsCS/_basic";
import useFormError from './hooks/useFormError';
import useStyles from "../assets/styles/_EditForm"
import TextArea from './TextArea'
import UploadBtnPdf from "./UploadBtnPdf";
import BackLink from "./BackLink";


function EditForm(props)
{
    const [TitleError, setTitleError, helperTitleText, setHelperTitleText, checkTitleKey, setTitleTrue, setTitleFalse, titleValid] = useFormError(false)
    const [DescError, setDescError, helperDescText, setHelperDescText, checkDescKey, setDescTrue, setDescFalse, descValid] = useFormError(false)

    const { declaration, handleSubmit, alert, switchLoading } = props;
    const { title, description, _id } = declaration;

    const [file, changeFile] = useState(declaration.file);
    const [editorState, setEditorState] = useState();

    const classes = useStyles();

    const errCheck = (e) =>
    {
        e.preventDefault();

        const { data, title, description } = handleDeclrData(e.currentTarget, file, editorState)

        if (titleValid(title) && descValid(description)) //add editor state
        {
            setTitleTrue()
            setDescTrue()
            handleSubmit(data)
        }
        else
        {

            if (!titleValid(title)) { setTitleFalse() }
            if (!descValid(description)) { setDescFalse() }
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={classes.Container}>
                <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                    <Article />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit {title}
                </Typography>
                {alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
                <Box
                    component="form"
                    error={TitleError}
                    onSubmit={errCheck}
                    noValidate
                    className={classes.Form}
                >
                    <TextField
                        margin="normal"
                        inputProps={{ maxLength: 10 }}
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

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>)
                    }



                    <TextArea
                        placeholder="Description"
                        setData={setEditorState}
                        error={DescError}
                        checkDescKey={checkDescKey}
                        data={JSON.parse(description)}
                    />

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={DescError}>{helperDescText}</FormHelperText>)
                    }

                    <UploadBtnPdf changeFile={changeFile} file={file} />
                    {switchLoading(0, () => (
                        <>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Finish
                            </Button>
                            <BackLink>Back</BackLink>
                        </>
                    ))}

                </Box>
            </Box>
        </Container>
    );
}

export default EditForm;
