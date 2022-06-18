import * as React from 'react';
import { Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Title from './Title';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	Table: {
		"& td": {
			color: theme.palette.text.default
		}
	}
}));
function Users(props)
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
			<Title>Recent Users</Title>
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
export default Users