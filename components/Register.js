import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Alert, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from 'next/link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useFormError from "./hooks/useFormError";
import { getCurrentDate } from '../utilsCS/_client';


const theme = createTheme();

function Register(props)
{
    const { handleSubmit, alert } = props;
    const [
        UsernameError,
        setUsernameError,
        helperUsernameText,
        setHelperUsernameText,
        checkUsernameKey,
        setUsernameTrue,
        setUsernameFalse,
        usernameValid,
    ] = useFormError(false);
    const [
        EmailError,
        setEmailError,
        helperEmailText,
        setHelperEmailText,
        checkEmailKey,
        setEmailTrue,
        setEmailFalse,
        emailValid,
    ] = useFormError(false);

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const username = data.get("username");
        const email = data.get("email");
        data.append("date", getCurrentDate("."))

        if (usernameValid(username)  && emailValid(email))
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
        <ThemeProvider theme={theme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    {alert && (
                        <Alert severity="error">{alert}</Alert>
                    )}
                    <Box
                        component="form"
                        noValidate
                        sx={{ mt: 3 }}
                        onSubmit={errCheck}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Link href="/">
                            Back
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    );
}

export default Register;
