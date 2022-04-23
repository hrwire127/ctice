import * as React from 'react';
import { Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Title from './Title';

export default function Declrs(props)
{
    const { declarations } = props

    function createData(id, date, title, file, by, views)
    {
        return { id, date, title, file, by, views };
    }


    const rows = declarations.map(el =>
    {
        return createData(
            el._id,
            el.date[0],
            el.title,
            el.file ? el.file.name : "nothing",
            "User",
            2,
        )
    })

    return (
        <>
            <Title>Recent Declarations</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell>By</TableCell>
                        <TableCell align="right">Views</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.file}</TableCell>
                            <TableCell>{rows.by}</TableCell>
                            <TableCell align="right">{row.views}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </>
    );
}