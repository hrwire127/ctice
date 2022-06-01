import React, { useState } from 'react'
import
{
	Avatar, Button, CssBaseline,
	TextField, FormControlLabel, Checkbox,
	Grid, Box, Typography, Container, Alert,
	FormHelperText, Link, Paper
} from '@mui/material';
import { CheckCircle, FileUpload } from '@mui/icons-material';
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import useFormError from "./hooks/useFormError";
import TransitionAlerts from './TransitionAlerts'
import UploadProfile from './UploadProfile'
import LocationSearch from "./LocationSearch"

function Change(props)
{
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


	const { changeAccDetails, user, isToken, alert, switchLoading, resetPassword } = props;
	const { username, status, date, email, profile, _id, bio } = user;
	const [image, setImage] = useState(profile.url !== process.env.NEXT_PUBLIC_DEF_PROFILE_URL && profile.url);
	const [location, setLocation] = useState(user.location)
	const [editorState, setEditorState] = useState(JSON.parse(bio));
	const classes = useStyles()

	const errCheck = async (e) =>
	{
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		if (data.get("username") === username) 
		{
			data.delete("username")
		}
		console.log(location)
		data.append("id", _id)
		data.append("location", JSON.stringify(location))
		data.append("bio", JSON.stringify(editorState))

		// const username = data.get("username");

		if (image) data.set("profile", image)


		// changeAccDetails(data);
	}

	return (
		<Box
			onSubmit={errCheck}
			component="form"
			noValidate
		>
			{alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
			<Grid container spacing={2}>
				<Grid item xs={4}>
					<UploadProfile profile={profile.url} image={image} setImage={setImage} />
				</Grid>
				<Grid
					item xs={8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: "space-evenly" }}
				>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						inputProps={{ maxLength: 10 }}
						required
						defaultValue={username}
						error={UsernameError}
						name="username"
						label="New Username"
						type="username"
						id="username"
						autoComplete="new-username"
						onKeyPress={checkUsernameKey}
					/>
					<LocationSearch
						defaultLocation={user.location}
						setLocation={setLocation}
						error={LocationError}
						onKeyPress={checkLocationKey}
						limit={5}
					/>
					<div>
						{isToken
							? (<Typography variant="h7" color="text.danger">
								An email was sent for the password reset
							</Typography>)
							: (<Link sx={{ "&:hover": { cursor: "pointer" } }} onClick={resetPassword}>
								Reset Password
							</Link>)
						}
					</div>

					<TextArea
						styles={classes.Editor}
						placeholder="Description"
						setData={setEditorState}
						error={DescError}
						checkDescKey={checkDescKey}
						data={JSON.parse(bio)}
					/>
				</Grid>
			</Grid>
			{Math.abs((new Date() - new Date(date[date.length - 1]) < process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY))
				? (<Typography variant="h7" color="text.danger">
					Please wait some time after the edit
				</Typography>)
				: (switchLoading(0, () =>
				(<>
					<Button
						type="submit"
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Save
					</Button>
				</>)))
			}
		</Box>
	)
}

export default Change