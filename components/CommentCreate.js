import React, { useState } from "react";
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
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import UploadBtn from "./UploadBtn";
import BackLink from "./BackLink";

const theme = createTheme();

export default function CommentCreate(props)
{
    const [
        ContentError,
        setContentError,
        helperContentText,
        setHelperContentText,
        checkContentKey,
        setContentTrue,
        setContentFalse,
        contentValid,
    ] = useFormError(false);

    const [editorState, setEditorState] = useState();

    const { handleSubmit, alert, switchLoading } = props;
    const classes = useStyles()

    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        data.append("content", JSON.stringify(editorState));
        data.append("date", new Date())

        const content = editorState.blocks[0].text;

        if (contentValid(content))
        {
            setContentTrue();
            handleSubmit(data);
        } else
        {
            setContentFalse();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box className={classes.Container}>
                    <Typography align="left" component="h6" variant="h6">
                        Create Comment
                    </Typography>
                    {alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
                    <Box
                        component="form"
                        enctype="multipart/form-data"
                        onSubmit={errCheck}
                        noValidate
                        className={classes.Form}
                    >

                        <TextArea
                            placeholder="Comment"
                            setData={setEditorState}
                            error={ContentError}
                            checkDescKey={checkContentKey}
                        />

                        {alert
                            ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                            : (<FormHelperText error={ContentError}>{helperContentText}</FormHelperText>)
                        }

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
                        </>))}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
