import React, { useState } from 'react'
import { Avatar, Button, TextField, Grid, Box, Typography, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "./hooks/useFormError";
import TransitionAlerts from './TransitionAlerts'
import BackLink from "./BackLink";
import useStyles from "../assets/styles/_Reset"
import Redirects_CS from '../utilsCS/CS_Redirects'
import useAlertMsg from './hooks/useAlertMsg'
import useLoading from './hooks/useLoading'

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
                    // Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    if (res.error) setAlertMsg(res.error.message, "error")
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
                sx={{ mt: 3, width: "60%", maxWidth: 400 }}
                onSubmit={errCheck}
            >
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