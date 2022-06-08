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
import Rules from "../utilsCS/clientRules"
import useLoading from './hooks/useLoading'

function CommentEdit(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

    const [alert, setAlert] = useState()
    const [editorState, setEditorState] = useState();
    const [submitWhile, submitSwitch] = useLoading(false)

    const { comment, setEdit, id, fullWhile } = props;
    const { content, _id: cid } = comment;

    const classes = useStyles()

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, Rules.form_message_delay);
    }

    const handleSubmit = async (body) =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    fullWhile(() =>
                    {
                        CS_Redirects.tryResCS(res, window)
                        if (res.err) setError(res.err.message)
                    })
                })
        })
    };

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
        <>
            {alert && (<TransitionAlerts type="error" setFlash={setAlert}>{alert}</TransitionAlerts>)}
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
        </>
    );
}
export default CommentEdit