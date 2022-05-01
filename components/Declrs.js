import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, IconButton } from '@mui/material';
import { RemoveRedEye, Build, Delete } from '@mui/icons-material';
import Title from './Title';
import Link from 'next/link'

export default function Declrs(props)
{
    const { declarations, onDelete, noControlls } = props

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
            el.authors[0],
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
                        {noControlls
                            ? (<TableCell align="right">Views</TableCell>)
                            : (<>
                                <TableCell>Views</TableCell>
                                <TableCell align="right">Controls</TableCell>
                            </>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.file}</TableCell>
                            <TableCell>{row.by}</TableCell>
                            {noControlls ? (<TableCell align="right">{row.views}</TableCell>) :
                                (<>
                                    <TableCell>{row.views}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: "right", gap: 1 }}>
                                            <IconButton sx={{ width: 3, height: 3 }}>
                                                <Link href={`/view/${row.id}`} >
                                                    <RemoveRedEye sx={{ fontSize: 20 }} />
                                                </Link>
                                            </IconButton>
                                            <IconButton sx={{ width: 3, height: 3 }}>
                                                <Link href={`/edit/${row.id}`}>
                                                    <Build sx={{ fontSize: 20 }} />
                                                </Link>
                                            </IconButton>
                                            <IconButton onClick={(e) => onDelete(e, row.id)} sx={{ width: 3, height: 3 }}>
                                                <Delete sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </>)}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </>
    );
}