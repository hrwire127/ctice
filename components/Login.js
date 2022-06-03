import React, { useState } from 'react';
import { Alert, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "./hooks/useFormError";
import BackLink from "./BackLink";
import useStyles from '../assets/styles/_Login'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from './hooks/useLoading'

function Login(props)
{
    const [UsernameError, , helperUsernameText, , checkUsernameKey, setUsernameTrue, setUsernameFalse, usernameValid,] = useFormError(false);
    const [PasswordError, , helperPasswordText, , checkPasswordKey, setPasswordTrue, setPasswordFalse, passwordValid,] = useFormError(false);


    const [alert, setAlert] = useState()
    const [remember, setRemember] = useState(false)
    const [loadingWhile, switchLoading] = useLoading(false)

    const classes = useStyles();

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                    else
                    {
                        window.location = (window.location.href !== document.referrer
                            ? document.referrer
                            : process.env.NEXT_PUBLIC_DR_HOST)
                    }
                })
        })
    };

    const errCheck = (e) =>
    {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        data.append("remember", remember)

        const username = data.get("username");
        const password = data.get("password");


        if (usernameValid(username) && passwordValid(password))
        {
            setUsernameTrue();
            setPasswordTrue();
            handleSubmit(data);
        } else
        {
            if (!usernameValid(username))
            {
                setUsernameFalse();
            }
            if (!passwordValid(password))
            {
                setPasswordFalse();
            }
        }
    };

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
                    Login
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
                                inputProps={{ maxLength: 10 }}
                                required
                                error={UsernameError}
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                onKeyPress={checkUsernameKey}
                                autoFocus
                            />
                            {alert
                                ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                                : (<FormHelperText error={UsernameError}>{helperUsernameText}</FormHelperText>)
                            }
                        </Grid>
                        <Grid item xs={12}>
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
                                autoComplete="current-password"
                                onKeyPress={checkPasswordKey}
                            />
                            {alert
                                ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                                : (<FormHelperText error={PasswordError}>{helperPasswordText}</FormHelperText>)
                            }
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" onChange={() => setRemember(!remember)} />}
                        label="Remember me"
                    />

                    {switchLoading(0, () =>
                    (<>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <BackLink>Back</BackLink>
                    </>
                    ))}

                </Box>
            </Box>
        </Container>
    );
}

export default Login;

