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
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";

function ReplyEdit(props)
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

    const { handleSubmit, alert, submitSwitch, reply, setEdit } = props;
    const { content, _id } = reply;

    const [editorState, setEditorState] = useState();

    const classes = useStyles()

    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        data.append("content", JSON.stringify(editorState));


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
                    placeholder="Reply"
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
                (<Box textAlign='center'>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Finish
                    </Button>
                    <Button
                        variant="text"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() =>
                        {
                            setEdit(false);
                            setEditorState(JSON.parse(content));
                        }}>
                        Cancel
                    </Button>
                </Box>))}

            </Box>
        </Box>
    );
}
export default ReplyEdit;