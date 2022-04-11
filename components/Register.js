import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Alert, FormHelperText } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from 'next/link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
        PasswordError,
        setPasswordError,
        helperPasswordText,
        setHelperPasswordText,
        checkPasswordKey,
        setPasswordTrue,
        setPasswordFalse,
        passwordValid,
    ] = useFormError(false);

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

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
                                    inputProps={{ maxLength: 10 }}
                                    required
                                    error={UsernameError}
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
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
                                    autoComplete="new-password"
                                    onKeyPress={checkPasswordKey}
                                />
                                {alert
                                    ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                                    : (<FormHelperText error={PasswordError}>{helperPasswordText}</FormHelperText>)
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
