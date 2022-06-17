import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Alert, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "./hooks/useFormError";
import BackLink from "./BackLink";
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from './hooks/useLoading'
import Rules from "../utilsCS/clientRules"


function Register(props)
{
    const { setError } = props
    const [UsernameError, , helperUsernameText, , checkUsernameKey, setUsernameTrue, setUsernameFalse, usernameValid,] = useFormError(false);
    const [EmailError, , helperEmailText, , checkEmailKey, setEmailTrue, setEmailFalse, emailValid,] = useFormError(false);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitLoading] = useLoading(false)

    const handleSubmit = async (body) =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/pending`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) return setError(res.error);
                    if (res.err) setAlertMsg(res.err.message, "error")
                })
        })
    };

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const username = data.get("username");
        const email = data.get("email");
        // data.append("date", new Date())

        if (usernameValid(username) && emailValid(email))
        {
            setUsernameTrue();
            setEmailTrue();
            handleSubmit(data);
        }
        else
        {
            if (!usernameValid(username))
            {
                setUsernameFalse();
            }
            if (!emailValid(email))
            {
                setEmailFalse();
            }
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'tertiary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h4">
                    Register
                </Typography>
                {alert && (
                    <Alert severity="error">{alert}</Alert>
                )}
                <Box
                    component="form"
                    enctype="multipart/form-data"
                    onSubmit={errCheck}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                inputProps={{ maxLength: 40 }}
                                required
                                error={EmailError}
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                onKeyPress={checkEmailKey}
                                autoFocus
                            />
                            {alert
                                ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                                : (<FormHelperText error={EmailError}>{helperEmailText}</FormHelperText>)
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                inputProps={{ maxLength: 10 }}
                                required
                                error={UsernameError}
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                onKeyPress={checkUsernameKey}
                            />
                            {alert
                                ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                                : (<FormHelperText error={UsernameError}>{helperUsernameText}</FormHelperText>)
                            }
                        </Grid>
                    </Grid>
                    {submitLoading(0, () =>
                    (<>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <BackLink>Back</BackLink></>))}
                </Box>
            </Box>
        </Container>
    );
}

export default Register;
