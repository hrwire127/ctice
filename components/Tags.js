import React from 'react'
import { Typography, Box, List, ListItem, ListItemText, TextField, FormHelperText, Button } from "@mui/material"
import useLoading from './hooks/useLoading'
import useFormError from "./hooks/useFormError";
import useAlertMsg from './hooks/useAlertMsg'
import TransitionAlerts from './TransitionAlerts'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getTags } from '../utilsCS/_get'

function Tags(props)
{
    const { tags, setTags } = props
    const [TagError, , helperTagText, , checkTagKey, setTagTrue, setTagFalse, tagValid] = useFormError(false);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitSwitch] = useLoading(false)

    const handleSubmit = (body) =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/tag`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    console.log(res)
                    if (res.err) setAlertMsg(res.err.message, "error")
                    else setAlertMsg(res.obj.message, res.obj.type)

                    if (!res.err)
                    {
                        const newTags = await getTags()
                        CS_Redirects.tryResCS(newTags, window)
                        setTags(newTags.obj)
                    }
                })
        })
    }

    const errCheck = async (e) =>
    {
        e.preventDefault();

        const data = new FormData(e.currentTarget)

        const tag = data.get('tag')

        console.log(tag)

        if (tagValid(tag))
        {
            setTagTrue();
            handleSubmit(data);
        }
        else
        {
            setTagFalse();
        }
    }

    return (
        <Box sx={{ mt: 4, p: 12 }}>
            <Typography variant="h5">Tags</Typography>
            <List>
                {tags.map(t => (
                    <ListItem key={t._id}>
                        <ListItemText
                            primary={t.content}
                        />
                    </ListItem>
                ))}
            </List>
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
            <Box
                component="form"
                enctype="multipart/form-data"
                onSubmit={errCheck}
                noValidate
            >
                <TextField
                    margin="normal"
                    inputProps={{ maxLength: 20 }}
                    required
                    error={TagError}
                    fullWidth
                    id="content"
                    label="Tag"
                    name="content"
                    autoComplete="content"
                    onKeyPress={checkTagKey}
                    autoFocus
                />
                {alert
                    ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                    : (<FormHelperText error={TagError}>{helperTagText}</FormHelperText>)
                }
                {submitSwitch(0, () => <Button variant="contained" color="success" type="submit">Create</Button>)}
            </Box>
        </Box>
    )
}

export default Tags