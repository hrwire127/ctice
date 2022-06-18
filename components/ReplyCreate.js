import React, { useState } from "react";
import
{
    Button,
    Box,
    FormHelperText,
} from "@mui/material";
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import Rules from "../utilsCS/clientRules"
import useLoading from "./hooks/useLoading"
import useAlertMsg from './hooks/useAlertMsg'
import Redirects_CS from '../utilsCS/CS_Redirects'

function ReplyCreate(props)
{
    const [ContentError, , helperContentText, , checkContentKey, setContentTrue, setContentFalse, contentValid,] = useFormError(false);

	const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [editorState, setEditorState] = useState();
    const [creatingWhile, creatingSwitch] = useLoading(false)

    const { id, cid, setError } = props;
    const classes = useStyles()

    const handleSubmit = async (body) =>
    {
        creatingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}/reply`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    // Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    if (res.error) setAlertMsg(res.error.message, "error")
                })
        })
    };

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
            {alert && (<TransitionAlerts type="error" setFlash={setAlert}>{alert}</TransitionAlerts>)}
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