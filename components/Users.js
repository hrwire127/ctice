import * as React from 'react';
import { Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Title from './Title';

export default function Users(props)
{
	const { users } = props

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
			<Table size="small">
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
							<TableCell>{row.date}</TableCell>
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