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
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";

export default function CommentEdit(props)
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

    const { handleSubmit, alert, submitSwitch, comment } = props;
    const { content, _id } = comment;

    const [editorState, setEditorState] = useState();

    const classes = useStyles()

    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        data.append("content", JSON.stringify(editorState));
        // data.append("date", new Date())


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
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={classes.Container}>
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
                        data={JSON.parse(content)}
                    />

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={ContentError}>{helperContentText}</FormHelperText>)
                    }

                    {submitSwitch(0, () =>
                    (<>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Finish
                        </Button>
                    </>))}
                </Box>
            </Box>
        </Container>
    );
}
