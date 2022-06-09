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
import parse from 'html-react-parser';
import useAlertMsg from './hooks/useAlertMsg'
import TransitionAlerts from './TransitionAlerts'
import DocView from './DocView'

function DocEditor()
{
    const [file, setFile] = useState("")
    const [html, setHtml] = useState("")
    const [width, setWidth] = useState("100%")
    const [setAlertMsg, alert, setAlert] = useAlertMsg()

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


    return (
        <Container component="main" maxWidth="xs">
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
            <Box sx={{
                marginTop: 16,
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
                    onChange={(e) => ReadFile(e)}
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
            </Box>
            {/* <Box sx={{ border: "1px solid gray", borderRadius: 1, width: 600 }}>
                <DocView url="https://res.cloudinary.com/dnu6yyl9d/raw/upload/v1654774675/ctice/banners/doc_pxgq6d.html" />
            </Box> */}
        </Container>
    )
}

export default DocEditor