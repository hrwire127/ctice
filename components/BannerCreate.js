import React, { useState, useRef } from 'react'
import
{
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    Slider
} from "@mui/material";
import { Article } from '@mui/icons-material'
import parse from 'html-react-parser'
import useAlertMsg from './hooks/useAlertMsg'
import TransitionAlerts from './TransitionAlerts'
import useLoading from './hooks/useLoading'
import useLocalStorage from "./hooks/useLocalStorage"
import useWindowSize from './hooks/useWindowSize';

function BannerCreate()
{
    const [windowSize] = useWindowSize();
    const [file, setFile] = useState("")
    const [html, setHtml] = useLocalStorage("banner_create", "", true)
    const [width, setWidth] = useState(600)
    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitSwitch] = useLoading(false)

    const inputFileRef = useRef(null);

    const options = {
        trim: true,
        replace: (domNode) =>
        {
            if (domNode.attribs && domNode.attribs.class === 'remove')
            {
                return <></>;
            }
        },
    };

    const ReadFile = (e) =>
    {
        var f = e.target.files[0];

        if (f)
        {
            setFile(f)
            var r = new FileReader();
            r.onload = function (e)
            {
                var contents = e.target.result;
                setHtml(contents)
            }
            r.readAsText(f);
        } else
        {
            setAlertMsg("failed to load file", "error")
        }
    }

    const onUpload = () =>
    {
        inputFileRef.current.click();
    }

    const onDelete = () =>
    {
        setFile(null)
        setHtml("")
        inputFileRef.current.value = ''
    }

    const handleSubmit = () =>
    {
        if (html !== "")
        {
            submitWhile(async () =>
            {
                await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/admin/banner`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: html.replace(/\s/g, '') }),
                }).then(response => response.json())
                    .then(async res =>
                    {
                        if (res.error) setAlertMsg(res.error.message, "error")
                    })
            })
        }
        else
        {
            setAlertMsg("Cannot be empty", "error")
        }
    }


    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 12 }} />
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}

            {windowSize > 720 ? (<Box sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 22
            }}>
                <Avatar sx={{ m: 1, backgroundColor: "primary" }}>
                    <Article />
                </Avatar>
                <input
                    ref={inputFileRef}
                    type="file"
                    id="file"
                    name="file"
                    hidden
                    onInput={(e) => ReadFile(e)}
                />
                <Box sx={{ display: "flex", gap: 5, justifyContent: "center", mb: 5 }}>
                    <Button variant="outlined" onClick={onUpload}>{file ? file.name : "Upload"}</Button>
                    <Button color="error" variant="contained" onClick={onDelete}>Delete</Button>
                </Box>

                <Box
                    sx={{
                        width: 600,
                        height: 400,
                    }}>
                    <TextField
                        fullWidth
                        placeholder="Html code"
                        multiline
                        rows={15}
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                    />
                    <Slider
                        sx={{ width: "100%" }}
                        size="small"
                        marks
                        defaultValue={600}
                        aria-label="Small"
                        valueLabelDisplay="auto"
                        step={100}
                        min={100}
                        max={1000}
                        onChange={(e, val) => setWidth(val)}
                    />
                </Box>
                <Box sx={{ border: "1px solid gray", borderRadius: 1, width: width }}>
                    {parse(html, options)}
                </Box>
                {
                    submitSwitch(0, () => <Button sx={{ mt: 2 }} color="success" variant="contained" onClick={handleSubmit}>Create</Button>)
                }
            </Box>)
                : (<Typography variant="h5" sx={{ mt: 10, textAlign: "center" }}>Cannot edit on that sreen width</Typography>)}
        </Container>
    )
}

export default BannerCreate