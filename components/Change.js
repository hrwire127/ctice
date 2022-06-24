import React, { useState, useEffect } from 'react'
import
{
	Button, TextField,
	Grid, Box, Typography, Link
} from '@mui/material';
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_Change";
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
	const { date, profile, bio, connections } = user;

	const [DescError, , , , checkDescKey] = useFormError(false);

	const [setFlashMsg, flash, setFlash] = useAlertMsg()
	const [updateTimer, delay, startTimer] = useTimer(0)
	const [username, setUsername] = useState(user.username)
	const [isOpen, setOpen] = useState(false)
	const [image, setImage] = useState(profile ? profile.url : null);
	const [location, setLocation] = useState(user.location ? user.location : undefined)
	const [editorState, setEditorState] = useState(JSON.parse(bio));

	const [submitWhile, submitSwitch] = useLoading(false)
	const [resetWhile, resetSwitch] = useLoading(false)

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
		resetWhile(async () =>
		{
			await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/send`, {
				method: 'POST',
			}).then(response => response.json())
				.then(res =>
				{
					Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
				})
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

	const onClear = () =>
	{
		setImage(profile.url)
		setLocation(user.location ? user.location : undefined)
		setEditorState(JSON.parse(bio));
		setFlashMsg("Cleared Inputs", "info")
		setUsername(user.username)
	}

	return (
		<Box
			component="main"
			className={classes.Container}
		>
			{flash && (<TransitionAlerts type={flash.type} setFlash={setFlash}>{flash.message}</TransitionAlerts>)}
			<Box
				className={classes.FrontInfo}
				sx={{ mb: 2 }}
				onSubmit={errCheck}
				component="form"
				noValidate
			>
				<Box className={classes.Profile}>
					<UploadProfile
						profile={profile.url}
						image={image}
						setImage={setImage}
						setOpen={setOpen}
					/>
				</Box>
				<Box className={classes.SecInfo}>
					<TextField
						fullWidth
						variant="outlined"
						margin="normal"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						inputProps={{ maxLength: 10 }}
						error={flash && flash.type === "error"}
						sx={{ minWidth: 200 }}
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
					<Box sx={{ mt: 2 }}>
						{isResetToken
							? (<Typography variant="h7" color="text.danger">
								An email was sent for the password reset
							</Typography>)
							: resetSwitch(0, () => (<Link sx={{ "&:hover": { cursor: "pointer" } }} onClick={resetPassword}>
								Reset Password
							</Link>))
						}
					</Box>
				</Box>
			</Box>

			{
				isOpen && (<ProfileWindow
					image={image}
					setImage={setImage}
					setOpen={setOpen}
				/>)
			}

			<TextArea
				styles={classes.Editor}
				placeholder="About you"
				setData={setEditorState}
				error={flash && flash.type === "error"}
				data={JSON.parse(bio)}
				checkDescKey={checkDescKey}
			/>

			<Box className={classes.Connections}>
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
						Cannot edit now, {delay} seconds remained
					</Typography>)
					: (submitSwitch(0, () =>
					(<Box sx={{ display: 'flex', gap: 1, justifyContent: "center" }}>
						<Button
							type="submit"
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Save
						</Button>
						<Button
							onClick={onClear}
							variant="contained"
							color="error"
							sx={{ mt: 3, mb: 2 }}
						>
							Clear
						</Button>
					</Box>)))
				}
			</Box>
		</Box>
	)
}

export default Change