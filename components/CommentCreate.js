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
import useLoading from './hooks/useLoading'
import useAlertMsg from './hooks/useAlertMsg'
import Redirects_CS from '../utilsCS/CS_Redirects'
import useLocalStorage from "./hooks/useLocalStorage"

function CommentCreate(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

    const { id, setError } = props;

    // console.log(`comment ${id}`)

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [editorState, setEditorState, resetEditorState] = useLocalStorage(`comment_${id}`)

    const [creatingWhile, creatingSwitch] = useLoading(false)

    const classes = useStyles()

    const handleSubmit = async (body) =>
    {
        creatingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) setAlertMsg(res.error.message, "error")
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    resetEditorState()
                })
        })
    }

    const errCheck = async (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        editorState.entityMap = {}
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
            <Typography align="left" component="h6" variant="h6">
                Your Comment
            </Typography>
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
                    data={editorState}
                    noImgs
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
                        Post
                    </Button>
                </Box>))}
            </Box>
        </Box>
    );
}

export default CommentCreate;