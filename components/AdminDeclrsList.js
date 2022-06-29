import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, IconButton } from '@mui/material';
import { RemoveRedEye, Build, Delete, Accessible } from '@mui/icons-material';
import Link from 'next/link';
import { makeStyles } from '@mui/styles';
import Redirects_CS from '../utilsCS/CS_Redirects'

const useStyles = makeStyles((theme) => ({
    Table: {
        "& td": {
            color: theme.palette.text.default
        }
    }
}));

export default function AdminDeclrsList(props)
{
    const { declarations, onDelete, noControlls, setError } = props
    const classes = useStyles();

    function createData(id, date, title, file, status, by)
    {
        return { id, date, title, file, status, by };
    }


    const rows = declarations.map(el =>
    {
        return createData(
            el._id,
            el.date[0],
            el.title,
            el.file ? el.file.name : "nothing",
            el.status,
            el.authors[0],
        )
    })

    const switchDeclr = (_id) =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}/switchstatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
            })
    }

    return (
        <>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Declarations
            </Typography>
            <Table size="small" className={classes.Table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>By</TableCell>
                        {!noControlls &&
                            (<TableCell align="right">Controls</TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody color="tertiary">
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.file}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.by}</TableCell>
                            {noControlls ? (<TableCell align="right">{row.views}</TableCell>) :
                                (<>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: "right", gap: 1 }}>
                                            <IconButton sx={{ width: 3, height: 3 }}>
                                                <Link href={`/view/${row.id}`} >
                                                    <RemoveRedEye color="tertiary" sx={{ fontSize: 20 }} />
                                                </Link>
                                            </IconButton>
                                            <IconButton sx={{ width: 3, height: 3 }}>
                                                <Link href={`/edit/${row.id}`}>
                                                    <Build color="tertiary" sx={{ fontSize: 20 }} />
                                                </Link>
                                            </IconButton>
                                            <IconButton onClick={(e) => onDelete(e, row.id)} sx={{ width: 3, height: 3 }}>
                                                <Delete color="tertiary" sx={{ fontSize: 20 }} />
                                            </IconButton>
                                            <IconButton onClick={() => switchDeclr(row.id)} sx={{ width: 3, height: 3 }}>
                                                <Accessible color="tertiary" sx={{ fontSize: 20 }} />
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