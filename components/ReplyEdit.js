import React, { useState } from "react";
import { Button, Box, FormHelperText, } from "@mui/material";
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import useLoading from './hooks/useLoading'
import Rules from '../utilsCS/clientRules'

function ReplyEdit(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

    const { reply, setEdit } = props;
    const { content, _id: rid  } = reply;

	const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitSwitch] = useLoading(false)
    const [editorState, setEditorState] = useState();

    const classes = useStyles()

    const handleSubmit = async (body) =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}/reply/${rid}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setAlertMsg(res.err.message, "error")
                })
        })

    };

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

            {alert && (<TransitionAlerts type="error" setFlash={setAlert}>{alert}</TransitionAlerts>)}
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