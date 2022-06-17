import React, { useState } from 'react'
import { Avatar, Button, TextField, Grid, Box, Typography, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "./hooks/useFormError";
import TransitionAlerts from './TransitionAlerts'
import BackLink from "./BackLink";
import useStyles from "../assets/styles/_Reset"

function Reset(props)
{
    const { confirmationCode, setError } = props

    const [PasswordError, , helperPasswordText, , checkPasswordKey, setPasswordTrue, setPasswordFalse, passwordValid,] = useFormError(false);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [loadingWhile, switchLoading] = useLoading(false)

    const classes = useStyles()

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)

        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset`, {
                method: 'POST',
                body,
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

        const password = data.get("password");

        if (passwordValid(password))
        {
            setPasswordTrue();
            handleSubmit(data);
        }
        else
        {
            setPasswordFalse();
        }
    }
    return (
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
                sx={{ mt: 3, width: 400 }}
                onSubmit={errCheck}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            inputProps={{ maxLength: 10 }}
                            required
                            error={PasswordError}
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onKeyPress={checkPasswordKey}
                        />
                        <FormHelperText error={PasswordError}>{helperPasswordText}</FormHelperText>
                    </Grid>
                </Grid>
                {switchLoading(0, () =>
                (<>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset
                    </Button>
                    <BackLink>Back</BackLink>
                </>))}
            </Box>
        </Box>
    )
}

export default Reset