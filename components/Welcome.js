import React, { useState } from 'react'
import
{
    Avatar, Button,
    TextField,
    Grid, Box, Typography,
    FormHelperText
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import TransitionAlerts from './TransitionAlerts'
import UploadProfile from './UploadProfile'
import useFormError from "./hooks/useFormError"
import LocationSearch from "./LocationSearch"
import useStyles from "../assets/styles/_Welcome"
import Rules from "../utilsCS/clientRules"
import useLoading from './hooks/useLoading'
import TextArea from "./TextArea"
import BackLink from "./BackLink"
import Redirects_CS from '../utilsCS/CS_Redirects'
import useAlertMsg from "./hooks/useAlertMsg"

function Welcome(props)
{
    const [PasswordError, , helperPasswordText, , checkPasswordKey, , , ,] = useFormError(false);
    const [LocationError, , , , checkLocationKey,] = useFormError(false);
    const [DescError, , , , checkDescKey,] = useFormError(false);

    const { confirmationCode, setError } = props

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [loadingWhile, loadingSwitch] = useLoading(false)
    const [image, setImage] = useState();
    const [editorState, setEditorState] = useState();
    const [location, setLocation] = useState()

    const classes = useStyles()

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)

        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/register`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) setAlertMsg(res.error.message, "error")
                    else Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                })
        })
    };

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (location) data.append("location", JSON.stringify(location))
        data.append("bio", JSON.stringify(editorState))

        if (image) data.append("profile", image)

        handleSubmit(data);
    }


    return loadingSwitch(0, () => (
        <Box className={classes.Container}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Please fill out the profile
            </Typography>
            {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
            <Box
                component="form"
                noValidate
                sx={{ mt: 3 }}
                onSubmit={errCheck}
            >
                <Grid container spacing={2} sx={{ mb: 5 }}>
                    <Grid item xs={4}>
                        <UploadProfile
                            setImage={setImage}
                            image={image}
                            noWindow
                        />
                        {/* {isOpen && (<ProfileWindow
                            image={image}
                            setImage={setImage}
                            setOpen={setOpen}
                        />)} */}
                    </Grid>
                    <Grid
                        item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-evenly" }}
                    >
                        <TextField
                            margin="normal"
                            inputProps={{ maxLength: 10 }}
                            required
                            error={PasswordError}
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onKeyPress={checkPasswordKey}
                        />
                        <FormHelperText error={PasswordError}>{helperPasswordText}</FormHelperText>
                        <LocationSearch
                            setLocation={setLocation}
                            error={LocationError}
                            onKeyPress={checkLocationKey}
                            limit={5}
                        />
                    </Grid>
                </Grid>

                <TextArea
                    placeholder="About you"
                    setData={setEditorState}
                    error={alert && alert.type === "error"}
                    checkDescKey={checkDescKey}
                />
                <Box sx={{ display: 'flex', justifyContent: "space-between", mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="twitter"
                        label="Twitter Link"
                        type="twitter"
                        id="twitter"
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="facebook"
                        label="Facebook Link"
                        type="facebook"
                        id="facebook"
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="linkedin"
                        label="Linkedin Link"
                        type="linkedin"
                        id="linkedin"
                    />
                </Box>

                {loadingSwitch(0, () =>
                (<Box sx={{ textAlign: "center" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>))}
            </Box>
        </Box>
    ))
}

export default Welcome