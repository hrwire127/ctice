import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useStyles from '../assets/styles/_Users';


function RecentUsers(props)
{
	const { users } = props
	const classes = useStyles();

	function createData(id, date, username, email, status)
	{
		return { id, date, username, email, status };
	}


	const rows = users.map(el =>
	{
		return createData(
			el._id,
			el.date,
			el.username,
			el.email,
			el.status,
		)
	})

	return (
		<>
			<Typography component="h2" variant="h6" color="primary" gutterBottom>
				Recent Users
			</Typography>
			<Table size="small" className={classes.Table}>
				<TableHead>
					<TableRow>
						<TableCell>Date</TableCell>
						<TableCell>Username</TableCell>
						<TableCell>Email</TableCell>
						<TableCell align="right">Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow key={row.id}>
							<TableCell>{new Date(row.date[0]).toISOString().substring(0, 10)}</TableCell>
							<TableCell>{row.username}</TableCell>
							<TableCell>{row.email}</TableCell>
							<TableCell align="right">{row.status}</TableCell>
						</TableRow>
					))}
				</TableBody>

			</Table>
		</>
	);
}
export default RecentUsers