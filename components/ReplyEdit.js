import React, { useState } from "react";
import { Button, Box, FormHelperText, } from "@mui/material";
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import useLoading from './hooks/useLoading'
import Rules from '../utilsCS/clientRules'
import Redirects_CS from '../utilsCS/CS_Redirects'
import useAlertMsg from './hooks/useAlertMsg'

function ReplyEdit(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

    const { reply, setEdit, setError, cid, id } = props;
    const { content, _id: rid } = reply;

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
                    if (res.error) setAlertMsg(res.error.message, "error")
                    else Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
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
        <Box sx={{ width: "80%" }}>
            <Box className={classes.Line} />
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
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