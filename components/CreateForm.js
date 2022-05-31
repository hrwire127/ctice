import React, { useState, useEffect } from "react";
import
{
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    FormHelperText,
    Link
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Article, Clear } from "@mui/icons-material";
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import { handleDeclrData } from "../utilsCS/_client";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import UploadBtnPdf from "./UploadBtnPdf";
import BackLink from "./BackLink";
import { useTheme } from '@mui/styles';

export default function CreateForm(props)
{
    const [
        TitleError,
        setTitleError,
        helperTitleText,
        setHelperTitleText,
        checkTitleKey,
        setTitleTrue,
        setTitleFalse,
        titleValid,
    ] = useFormError(false);
    const [
        DescError,
        setDescError,
        helperDescText,
        setHelperDescText,
        checkDescKey,
        setDescTrue,
        setDescFalse,
        descValid,
    ] = useFormError(false);

    const [file, changeFile] = useState();
    const [editorState, setEditorState] = useState();

    const { handleSubmit, alert, switchLoading } = props;
    const classes = useStyles()

    // useEffect(() =>
    // {
    //     const element = document.querySelector('.RichEditor-root')
    //     element.addEventListener("mouseenter", () => {
    //         element.style.borderColor = theme.palette.primary;
    //       }, false);
    // }, [])


    const errCheck = async (e) =>
    {
        e.preventDefault();

        const { data, title, description } = handleDeclrData(e.currentTarget, file, editorState)

        if (titleValid(title) && descValid(description))
        {
            setTitleTrue();
            setDescTrue();
            handleSubmit(data);
        } else
        {
            if (!titleValid(title))
            {
                setTitleFalse();
            }
            if (!descValid(description))
            {
                setDescFalse();
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={classes.Container}>
                <Avatar sx={{ m: 1, bgcolor: "primary" }}>
                    <Article />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Declaration
                </Typography>
                {alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
                <Box
                    component="form"
                    enctype="multipart/form-data"
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
                    />
                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>)
                    }

                    <TextArea
                        styles={classes.Editor}
                        placeholder="Description"
                        setData={setEditorState}
                        error={DescError}
                        checkDescKey={checkDescKey}
                    />

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={DescError}>{helperDescText}</FormHelperText>)
                    }

                    <UploadBtnPdf changeFile={changeFile} file={file} />

                    {switchLoading(0, () =>
                    (<>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                        <BackLink>Back</BackLink>
                    </>))}
                </Box>
            </Box>
        </Container>
    );
}
