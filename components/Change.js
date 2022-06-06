import React, { useState, useEffect } from 'react'
import
{
	Button, TextField,
	Grid, Box, Typography, Link
} from '@mui/material';
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import useFormError from "./hooks/useFormError";
import TransitionAlerts from './TransitionAlerts'
import UploadProfile from './UploadProfile'
import CS_Redirects from '../utilsCS/CS_Redirects'
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
	const [flash, setFlash] = useState()
	const [isDelayed, setIsDelay] = useState(Math.abs((new Date() - new Date(date[date.length - 1]) < process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY)))
	const [image, setImage] = useState(profile.url !== process.env.NEXT_PUBLIC_DEF_PROFILE_URL && profile.url);
	const [location, setLocation] = useState(user.location ? user.location : undefined)
	const [editorState, setEditorState] = useState(JSON.parse(bio));

	const [submitWhile, submitSwitch] = useLoading(false)

	const classes = useStyles()
	let delay = Math.abs((process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY - (new Date() - new Date(date[date.length - 1]))));

	const setDelay = () =>
	{
		setIsDelay(true)
		setTimeout(() =>
		{
			setIsDelay(false)
		}, process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY);
	}

	const setError = (msg) =>
	{
		setAlert(msg)
		setTimeout(() =>
		{
			setAlert()
		}, Rules.form_message_delay);
	}

	const setMessage = (obj) =>
	{
		setFlash(obj)
		setTimeout(() =>
		{
			setFlash()
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
					if (res.err)
					{
						setError(err)
					}
					else
					{
						setMessage(res.obj)
						setDelay()
					}
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

		if (location) data.append("location", JSON.stringify(location))
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
			{flash && (<TransitionAlerts type={flash.type}>{flash.message}</TransitionAlerts>)}
			{alert && (<TransitionAlerts type="error">{alert}</TransitionAlerts>)}
			<Grid container spacing={2} sx={{ mb: 2 }}>
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
						defaultValue={username}
						error={UsernameError}
						name="username"
						label="Username"
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
				</Grid>
			</Grid>
			<TextArea
				styles={classes.Editor}
				placeholder="Description"
				setData={setEditorState}
				error={DescError}
				checkDescKey={checkDescKey}
				data={JSON.parse(bio)}
			/>

			<Box sx={{ display: 'flex', justifyContent: "space-between", mt: 2 }}>
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
			</Box>

			<Box sx={{ textAlign: "center" }}>
				{isDelayed
					? (<Typography variant="h7" color="text.danger">
						Please wait some time after the edit, {Math.round(delay / 1000)} seconds remained
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
		</Box >
	)
}

export default Change