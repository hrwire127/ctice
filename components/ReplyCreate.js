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

function ReplyCreate(props)
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

    const { handleSubmit, alert, creatingSwitch } = props;
    const classes = useStyles()

    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        data.append("content", JSON.stringify(editorState));
        // data.append("date", new Date())

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
        <Box>
            {alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
            <Box
                component="form"
                enctype="multipart/form-data"
                onSubmit={errCheck}
                noValidate
                className={classes.Form}
            >

                <TextArea
                    placeholder="Your Reply"
                    setData={setEditorState}
                    error={ContentError}
                    checkDescKey={checkContentKey}
                />

                {alert
                    ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                    : (<FormHelperText error={ContentError}>{helperContentText}</FormHelperText>)
                }

                {creatingSwitch(0, () =>
                (<Box textAlign='center'>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send
                    </Button>
                </Box>))}
            </Box>
        </Box>
    );
}
export default ReplyCreate