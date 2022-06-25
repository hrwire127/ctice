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
import useLoading from './hooks/useLoading';
import Redirects_CS from '../utilsCS/CS_Redirects'
import useLocalStorage from "./hooks/useLocalStorage"
import useWindowSize from './hooks/useWindowSize';

function NotifCreate(props)
{
    const { setError } = props
    const [windowSize] = useWindowSize();
    const [fileNotif, setFileNotif] = useState("")
    const [htmlNotif, setHtmlNotif] = useLocalStorage("notification_create", "", true)
    const [fileBanner, setFileBanner] = useState("")
    const [htmlBanner, setHtmlBanner] = useLocalStorage("notification_banner_create", "", true)
    const [submitWhile, submitSwitch] = useLoading(false)

    const [setAlertMsg, alert, setAlert] = useAlertMsg()

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

    const ReadFile = (e, setFile, setHtml) =>
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

    const onUpload = (inputFileRef) =>
    {
        inputFileRef.current.click();
    }

    const onDelete = (setFile, setHtml, inputFileRef) =>
    {
        setFile(null)
        setHtml("")
        inputFileRef.current.value = ''
    }


    const handleSubmit = () =>
    {
        if (htmlNotif !== "")
        {
            submitWhile(async () =>
            {
                await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/admin/notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: htmlNotif.replace(/\s/g, ''), banner: htmlBanner !== "" ? htmlBanner.replace(/\s/g, '') : undefined }),
                }).then(response => response.json())
                    .then(async res =>
                    {
                        // Redirects_CS.handleRes(res)
                        if (res.error) setAlertMsg(res.error.message, "error")
                    })
            })
        }
        else
        {
            setAlertMsg("Cannot be empty", "error")
        }
    }

    const inputFileRefNotif = useRef(null);
    const [widthNotif, setWidthNotif] = useState(600)

    const inputFileRefBanner = useRef(null);
    const [widthBanner, setWidthBanner] = useState(600)

    return (
        <Container component="main" maxWidth="xs">
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}

            {windowSize > 720 ? (
                <Box sx={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 22
                }}>
                    <Box>
                        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                            Create Notification
                        </Typography>
                        <input
                            ref={inputFileRefNotif}
                            type="file"
                            id="file"
                            name="file"
                            hidden
                            onChange={(e) => ReadFile(e, setFileNotif, setHtmlNotif)}
                        />
                        <Box sx={{ display: "flex", gap: 5, justifyContent: "center", mb: 5 }}>
                            <Button variant="outlined" onClick={() => onUpload(inputFileRefNotif)}>{fileNotif ? fileNotif.name : "Upload"}</Button>
                            <Button color="error" variant="contained" onClick={() => onDelete(setFileNotif, setHtmlNotif, inputFileRefNotif)}>Delete</Button>
                        </Box>

                        <Box
                            sx={{
                                width: 600,
                                height: 400,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Html code"
                                multiline
                                rows={15}
                                value={htmlNotif}
                                onChange={(e) => setHtmlNotif(e.target.value)}
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
                                onChange={(e, val) => setWidthNotif(val)}
                            />
                        </Box>
                        <Box sx={{ border: "1px solid gray", borderRadius: 1, width: widthNotif }}>
                            {parse(htmlNotif, options)}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 5, position: "relative" }}>
                        <Box sx={htmlNotif !== "" ? {} : { zIndex: 3, position: "absolute", width: "100%", height: "100%", backgroundColor: "gray", opacity: "0.5" }} />
                        <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
                            Extra Banner
                        </Typography>
                        <input
                            ref={inputFileRefBanner}
                            type="file"
                            id="file"
                            name="file"
                            hidden
                            onChange={(e) => ReadFile(e, setFileBanner, setHtmlBanner)}
                        />
                        <Box sx={{ display: "flex", gap: 5, justifyContent: "center", mb: 5 }}>
                            <Button variant="outlined" onClick={() => onUpload(inputFileRefBanner)}>{fileBanner ? fileBanner.name : "Upload"}</Button>
                            <Button color="error" variant="contained" onClick={() => onDelete(setFileBanner, setHtmlBanner, inputFileRefBanner)}>Delete</Button>
                        </Box>
                        <Box
                            sx={{
                                width: 600,
                                height: 400,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Html code"
                                multiline
                                rows={15}
                                value={htmlBanner}
                                onChange={(e) => setHtmlBanner(e.target.value)}
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
                                onChange={(e, val) => setWidthBanner(val)}
                            />
                        </Box>
                        <Box sx={{ border: "1px solid gray", borderRadius: 1, width: widthBanner }}>
                            {parse(htmlBanner, options)}
                        </Box>
                    </Box>

                    {
                        submitSwitch(0, () => <Button sx={{ mt: 2 }} color="success" variant="contained" onClick={handleSubmit}>Create</Button>)
                    }
                </Box >)
                : (<Typography variant="h5" sx={{ mt: 10, textAlign: "center" }}>Cannot edit on that sreen width</Typography>)}
        </Container >
    )
}

export default NotifCreate