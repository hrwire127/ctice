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
import UploadIconProfile from './UploadIconProfile'
import LocationSearch from "./LocationSearch"
import useLoading from './hooks/useLoading'
import Rules from "../utilsCS/clientRules"

function Change(props)
{
	const [UsernameError, , , , checkUsernameKey] = useFormError(false);

	const [LocationError, , , , checkLocationKey] = useFormError(false);

	const [DescError, , , , checkDescKey] = useFormError(false);

	const { user, isResetToken } = props;
	const { username, date, profile, bio, connections } = user;

	const [alert, setAlert] = useState()
	const [image, setImage] = useState(profile.url !== process.env.NEXT_PUBLIC_DEF_PROFILE_URL && profile.url);
	const [location, setLocation] = useState(user.location)
	const [editorState, setEditorState] = useState(JSON.parse(bio));

	const [submitWhile, submitSwitch] = useLoading(false)

	const isDelayed = Math.abs((new Date() - new Date(date[date.length - 1]) < process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY))
	const classes = useStyles()

	const setError = (msg) => 
	{
		setAlert(msg)
		setTimeout(() =>
		{
			setAlert()
		}, Rules.form_message_delay);
	}

	const resetPassword = async () =>
	{
		await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/send`, {
			method: 'POST',
		}).then(response => response.json())
			.then(res =>
			{
				CS_Redirects.tryResCS(res, window)
			})
	}

	const handleSubmit = async (body) => 
	{
		submitWhile(async () =>
		{
			await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/change`, {
				method: 'POST',
				body,
			}).then(response => response.json())
				.then(async res =>
				{
					CS_Redirects.tryResCS(res, window)
					if (res.err) setError(res.err.message)
				})
		})
	}
	const errCheck = async (e) =>
	{
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		if (data.get("username") === username) 
		{
			data.delete("username")
		}

		data.append("location", JSON.stringify(location))
		data.append("bio", JSON.stringify(editorState))

		if (image) data.set("profile", image)

		handleSubmit(data);
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
					<UploadIconProfile profile={profile.url} image={image} setImage={setImage} />
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
						{isResetToken
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
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						defaultValue={connections ? connections.twitter : ""}
						name="twitter"
						label="Twitter Link"
						type="twitter"
						id="twitter"
					/>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						defaultValue={connections ? connections.facebook : ""}
						name="facebook"
						label="Facebook Link"
						type="facebook"
						id="facebook"
					/>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						defaultValue={connections && connections.linkedin}
						name="linkedin"
						label="Linkedin Link"
						type="linkedin"
						id="linkedin"
					/>
				</Grid>
			</Grid>
			{isDelayed
				? (<Typography variant="h7" color="text.danger">
					Please wait some time after the edit
				</Typography>)
				: (submitSwitch(0, () =>
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