import React from 'react'
import { IconButton, Typography, Box, Paper, Card, Grid, CardContent, TextField, FormHelperText, Button } from "@mui/material"
import { Delete } from "@mui/icons-material"
import useLoading from './hooks/useLoading'
import useFormError from "./hooks/useFormError"
import useAlertMsg from './hooks/useAlertMsg'
import TransitionAlerts from './TransitionAlerts'
import { getTags } from '../utilsCS/_get'
import Redirects_CS from '../utilsCS/CS_Redirects'
import useLocalStorage from "./hooks/useLocalStorage"
import useWindowSize from './hooks/useWindowSize';

function Tags(props)
{
    const { tags, setTags, setError } = props
    const [TagError, , helperTagText, , checkTagKey, setTagTrue, setTagFalse, tagValid] = useFormError(false);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitSwitch] = useLoading(false)
    const [windowSize] = useWindowSize();
    const [tag, setTag, resetTag] = useLocalStorage("tag_create", "")

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
                    if (res.error) setAlertMsg(res.error.message, "error")
                    else setAlertMsg(res.obj.message, res.obj.type)

                    if (!res.error)
                    {
                        const newTags = await getTags()
                        Redirects_CS.handleRes(newTags, typeof window !== "undefined" && window, setError)
                        setTags(newTags.obj)
                        resetTag()
                    }
                })
        })
    }

    const onDelete = async (id) =>
    {
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/tag/${id}`, {
            method: 'DELETE',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                if (res.obj === true) setTags(tags.filter(t => t._id !== id))
            })
    }

    const errCheck = async (e) =>
    {
        e.preventDefault();

        const data = new FormData(e.currentTarget)

        const tag = data.get('tag')

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
            {windowSize > 860 ? (
                <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
                    {tags.map(t => <Grid
                        key={t._id}
                        item xs={4}
                    >
                        <Paper
                            key={t._id} sx={{ width: 200, height: 60, display: 'flex', justifyContent: "space-evenly", alignItems: "center" }}
                        >
                            <IconButton onClick={() => onDelete(t._id)}><Delete /></IconButton>
                            <Typography>{t.content}</Typography>
                        </Paper>
                    </Grid>)}
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                    {tags.map(t => <Paper
                        key={t._id} sx={{ width: 200, height: 60, display: 'flex', justifyContent: "space-evenly", alignItems: "center" }}
                    >
                        <IconButton onClick={() => onDelete(t._id)}><Delete /></IconButton>
                        <Typography>{t.content}</Typography>
                    </Paper>
                    )}
                </Box>)}
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
            <Box
                component="form"
                enctype="multipart/form-data"
                onSubmit={errCheck}
                noValidate
            >
                <TextField
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
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
                {alert && alert.type === "error"
                    ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                    : (<FormHelperText error={TagError}>{helperTagText}</FormHelperText>)
                }
                {submitSwitch(0, () => <Button variant="contained" color="success" type="submit">Create</Button>)}
            </Box>
        </Box>
    )
}

export default Tags