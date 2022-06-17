import React, { useState } from 'react'
import
{
    Avatar, Button,
    TextField,
    Grid, Box, Typography,
    FormHelperText
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TransitionAlerts from './TransitionAlerts'
import UploadProfile from './UploadProfile';
import useFormError from "./hooks/useFormError";
import LocationSearch from "./LocationSearch"
import CS_Redirects from '../utilsCS/CS_Redirects'
import useStyles from "../assets/styles/_Welcome"
import Rules from "../utilsCS/clientRules"
import useLoading from './hooks/useLoading'
import TextArea from "./TextArea";
import BackLink from "./BackLink";

function Welcome(props)
{
    const [PasswordError, , helperPasswordText, , checkPasswordKey, , , ,] = useFormError(false);
    const [LocationError, , , , checkLocationKey,] = useFormError(false);
    const [DescError, , , , checkDescKey,] = useFormError(false);

    const { confirmationCode, setError } = props

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [loadingWhile, loadingSwitch] = useLoading(false)
    const [image, changeImage] = useState();
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
                    if (res.error) return setError(res.error)
                    if (res.err) setAlertMsg(res.err.message, "error")
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
                Please introduce a password
            </Typography>
            {alert && (<TransitionAlerts type="error" setFlash={setAlert}>{alert}</TransitionAlerts>)}
            <Box
                component="form"
                noValidate
                sx={{ mt: 3 }}
                onSubmit={errCheck}
            >
                <Grid container spacing={2}>
                    <Grid item xs={4}>
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
                    </Grid>
                    <Grid item xs={4}>
                        <UploadProfile changeFile={changeImage} file={image} />
                    </Grid>
                    <Grid item xs={4}>
                        <LocationSearch
                            setLocation={setLocation}
                            error={LocationError}
                            onKeyPress={checkLocationKey}
                            limit={5}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextArea
                            placeholder="Description"
                            setData={setEditorState}
                            error={DescError}
                            checkDescKey={checkDescKey}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            name="twitter"
                            label="Twitter Link"
                            type="twitter"
                            id="twitter"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            name="facebook"
                            label="Facebook Link"
                            type="facebook"
                            id="facebook"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            name="linkedin"
                            label="Linkedin Link"
                            type="linkedin"
                            id="linkedin"
                        />
                    </Grid>
                </Grid>

                {loadingSwitch(0, () =>
                (<>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <BackLink>Back</BackLink>
                </>))}
            </Box>
        </Box>
    ))
}

export default Welcome