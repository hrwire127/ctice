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
import LocationSearch from "./LocationSearch"
import useLoading from './hooks/useLoading'
import ProfileWindow from './ProfileWindow';
import useAlertMsg from './hooks/useAlertMsg'
import useTimer from './hooks/useTimer'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'

function Change(props)
{
	const { user, isResetToken, setError } = props;
	const { username, date, profile, bio, connections } = user;

	const [DescError, , , , checkDescKey] = useFormError(false);

	const [setFlashMsg, flash, setFlash] = useAlertMsg()
	const [updateTimer, delay, startTimer] = useTimer(0)
	const [isOpen, setOpen] = useState(false)
	const [image, setImage] = useState(profile.url !== process.env.NEXT_PUBLIC_DEF_PROFILE_URL && profile.url);
	const [location, setLocation] = useState(user.location ? user.location : undefined)
	const [editorState, setEditorState] = useState(JSON.parse(bio));

	const [submitWhile, submitSwitch] = useLoading(false)

	const classes = useStyles()

	useEffect(() =>
	{
		const diff = Math.round(process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY / 1000 - (new Date() - new Date(date[date.length - 1])) / 1000)
		startTimer(diff > 0 ? diff : 0)
	}, [])

	useEffect(() =>
	{
		return updateTimer()
	}, [delay]);

	const resetPassword = async () =>
	{
		await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/send`, {
			method: 'POST',
		}).then(response => response.json())
			.then(res =>
			{
				Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
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
                    // Redirects_CS.handleRes(res)
					if (res.error)
					{
						setFlashMsg(res.error.message, "error")
					}
					else
					{
						setFlashMsg(res.obj.message, "success")
						startTimer(process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY / 1000)
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
			{flash && (<TransitionAlerts type={flash.type} setFlash={setFlash}>{flash.message}</TransitionAlerts>)}
			<Grid container spacing={2} sx={{ mb: 5 }}>
				<Grid item xs={4}>
					<UploadProfile
						profile={profile.url}
						image={image}
						setImage={setImage}
						setOpen={setOpen}
					/>
					{isOpen && (<ProfileWindow
						image={image}
						setImage={setImage}
						setOpen={setOpen}
					/>)}
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
						error={flash && flash.type === "error"}
						name="username"
						label="Username"
						type="username"
						id="username"
						autoComplete="new-username"
					/>
					<LocationSearch
						defaultLocation={user.location}
						setLocation={setLocation}
						error={flash && flash.type === "error"}
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
				placeholder="About you"
				setData={setEditorState}
				error={flash && flash.type === "error"}
				data={JSON.parse(bio)}
				checkDescKey={checkDescKey}
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
					error={flash && flash.type === "error"}
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
					error={flash && flash.type === "error"}
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
					error={flash && flash.type === "error"}
				/>
			</Box>

			<Box sx={{ textAlign: "center" }}>
				{delay > 0
					? (<Typography variant="h7" color="text.danger">
						Please wait some time after the edit, {delay} seconds remained
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