import React, { useState } from 'react'
import
{
    Avatar, Button, CssBaseline,
    TextField, FormControlLabel, Checkbox,
    Grid, Box, Typography, Container, Alert,
    FormHelperText
} from '@mui/material';
import TransitionAlerts from './TransitionAlerts'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useFormError from "./hooks/useFormError";
import BackLink from "./BackLink";
import UploadBtnProfile from './UploadBtnProfile';
import LocationSearch from "./LocationSearch"
import TextArea from "./TextArea";

function Welcome(props)
{
    const { handleSubmit, alert, switchLoading } = props;
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

	const [
		LocationError,
		setLocationError,
		helperLocationText,
		setHelperLocationText,
		checkLocationKey,
		setLocationTrue,
		setLocationFalse,
		locationValid,
	] = useFormError(false);
    
	const [
		DescError,
		setDescError,
		helperDescText,
		setHelperDescText,
		checkDescKey,
		setDescTrue,
		setDescFalse,
		descValid,
	] = useFormError(false);
    
    const [file, changeFile] = useState();
	const [editorState, setEditorState] = useState();
	const [location, setLocation] = useState(user.location)

    const errCheck = (e) =>
    {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if (file) data.append("profile", file)

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
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Please introduce a password
            </Typography>
            {alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
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
                    <Grid item xs={12}>
                        <UploadBtnProfile changeFile={changeFile} file={file} />
                    </Grid>
                    <Grid item xs={12}>
                        <LocationSearch
                            setLocation={setLocation}
                            error={LocationError}
                            onKeyPress={checkLocationKey}
                            limit={5}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextArea
                            placeholder="Description"
                            setData={setEditorState}
                            error={DescError}
                            checkDescKey={checkDescKey}
                        />
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
                        Register
                    </Button>
                    <BackLink>Back</BackLink>
                </>))}
            </Box>
        </Box>
    )
}

export default Welcome