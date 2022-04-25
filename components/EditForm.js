import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TransitionAlerts from './TransitionAlerts'
import { Article, Clear } from '@mui/icons-material';
import { handleFormData } from "../utilsCS/_client";
import useFormError from './hooks/useFormError';
import useStyles from "../assets/styles/_EditForm"
import TextArea from './TextArea'
import UploadBtn from "./UploadBtn";
import BackLink from "./BackLink";

const theme = createTheme();

function EditForm(props)
{
    const [TitleError, setTitleError, helperTitleText, setHelperTitleText, checkTitleKey, setTitleTrue, setTitleFalse, titleValid] = useFormError(false)
    const [DescError, setDescError, helperDescText, setHelperDescText, checkDescKey, setDescTrue, setDescFalse, descValid] = useFormError(false)

    const { declaration, handleSubmit, alert } = props;
    const { title, description, _id } = declaration;

    const [file, changeFile] = useState(declaration.file);
    const [editorState, setEditorState] = useState();

    const classes = useStyles();

    const errCheck = (e) =>
    {
        e.preventDefault();

        const { data, title, description } = handleFormData(e.currentTarget, file, editorState)

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
                            setData={setEditorState}
                            error={DescError}
                            checkDescKey={checkDescKey}
                            data={JSON.parse(description)}
                        />

                        {alert
                            ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                            : (<FormHelperText error={DescError}>{helperDescText}</FormHelperText>)
                        }

                        <UploadBtn changeFile={changeFile} file={file} />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Finish
                        </Button>
                        <BackLink>Back</BackLink>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EditForm;
