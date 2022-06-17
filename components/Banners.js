import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box, IconButton } from '@mui/material';
import { RemoveRedEye, Build, Delete, Accessible, InsertLink } from '@mui/icons-material';
import Title from './Title';
import Link from 'next/link';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Table: {
        "& td": {
            color: theme.palette.text.default
        }
    }
}));

function Banners(props)
{
    const { banners, onDelete, setError } = props
    const classes = useStyles();

    function createData(id, date, type, status, url)
    {
        return { id, date, type, status, url };
    }


    const rows = banners.map(el =>
    {
        return createData(
            el._id,
            el.date[0],
            el.type,
            el.status,
            el.content
        )
    })

    const switchBanner = (_id) =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/admin/banner/${_id}/switch`, {
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
                if (res.error) return setError(res.error)
            })
    }

    return (
        <>
            <Title>Recent Declarations</Title>
            <Table size="small" className={classes.Table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Controls</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody color="tertiary">
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.views}</TableCell>
                            <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: "right", gap: 1 }}>
                                    <IconButton sx={{ width: 3, height: 3 }}>
                                        <Link href={`/admin/banner/${row.id}`}>
                                            <Build color="tertiary" sx={{ fontSize: 20 }} />
                                        </Link>
                                    </IconButton>
                                    <IconButton onClick={(e) => onDelete(e, row.id)} sx={{ width: 3, height: 3 }}>
                                        <Delete color="tertiary" sx={{ fontSize: 20 }} />
                                    </IconButton>
                                    <IconButton onClick={() => switchBanner(row.id)} sx={{ width: 3, height: 3 }}>
                                        <Accessible color="tertiary" sx={{ fontSize: 20 }} />
                                    </IconButton>
                                    <a href={row.url}>
                                        <IconButton sx={{ width: 3, height: 3 }}>
                                            <InsertLink />
                                        </IconButton>
                                    </a>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </>
    );
}

export default Banners