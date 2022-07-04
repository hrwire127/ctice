import React, { useState } from 'react';
import { Alert, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "../hooks/useFormError";
import BackLink from "../BackLink";
import useStyles from '../../assets/styles/_Login'
import useLoading from '../hooks/useLoading'
import Rules from "../../utilsCS/clientRules"
import useAlertMsg from '../hooks/useAlertMsg'
import Redirects_CS from '../../utilsCS/CS_Redirects'

function Login(props)
{
    const { setError } = props
    const [UsernameError, , helperUsernameText, , checkUsernameKey, setUsernameTrue, setUsernameFalse, usernameValid,] = useFormError(false);
    const [PasswordError, , helperPasswordText, , checkPasswordKey, setPasswordTrue, setPasswordFalse, passwordValid,] = useFormError(false);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [remember, setRemember] = useState(false)
    const [loadingWhile, switchLoading] = useLoading(false)

    const classes = useStyles();

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
                    if (res.error) setAlertMsg(res.error.message, "error")
                    else if (window.location.href === document.referrer || document.referrer !== "")
                    {
                        window.location = process.env.NEXT_PUBLIC_DR_HOST
                    }
                    else
                    {
                        window.location = document.referrer
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
                    <Alert severity={alert.type}>{alert.message}</Alert>
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

