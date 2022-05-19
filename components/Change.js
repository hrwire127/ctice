import React, { useState } from 'react'
import
{
	Avatar, Button, CssBaseline,
	TextField, FormControlLabel, Checkbox,
	Grid, Box, Typography, Container, Alert,
	FormHelperText, Link, Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import useFormError from "./hooks/useFormError";
import TransitionAlerts from './TransitionAlerts'

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

	const { changeAccDetails, user, isToken, alert, switchLoading, resetPassword } = props;
	const { username, status, date, email, profile, _id } = user;

	console.log((new Date()- new Date(date[date.length - 1])))

	const errCheck = (e) =>
	{
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		data.append("id", _id)

		const username = data.get("username");
		console.log(data)


		if (usernameValid(username))
		{
			setUsernameTrue();
			changeAccDetails(data);
		}
		else
		{
			setUsernameFalse();
		}
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
					<img
						style={{
							height: "100%",
							width: "100%",
							border: "2px solid red",
							borderRadius: 10,
						}}
						src={profile} />
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
						error={UsernameError}
						name="username"
						label="New Username"
						type="username"
						id="username"
						autoComplete="new-username"
						onKeyPress={checkUsernameKey}
					/>
					<TextField fullWidth label="Location" variant="outlined" />
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
				</Grid>
			</Grid>
			{Math.abs((new Date()- new Date(date[date.length - 1]) < process.env.NEXT_PUBLIC_ACCOUNT_EDIT_DELAY))
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