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
import CS_Redirects from '../utilsCS/CS_Redirects'
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import useLoading from './hooks/useLoading'
import useAlertMsg from './hooks/useAlertMsg'


function CommentCreate(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

	const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [editorState, setEditorState] = useState();

    const [creatingWhile, creatingSwitch] = useLoading(false)

    const { id } = props;
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
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setAlertMsg(res.err.message, "error")
                })
        })
    }

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