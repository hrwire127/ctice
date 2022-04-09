import React from 'react';
import { Alert, Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrList';

function DeclrList(props)
{
    const { declarations, flash, value } = props;
    const classes = useStyles();
    return (
        <>
            {
                flash && (<Alert severity={flash.type}>{flash.message}</Alert>)
            }
            {value && (<Typography>AAAAAAAAAAAAA</Typography>)}
            <Box className={classes.Bar}>
                <Typography variant="h4" >
                    Announcements
                </Typography>
                <ButtonGroup aria-label="button group">
                    <Link href="/create"><IconButton variant="outlined"><Add></Add></IconButton></Link> {/* todo add more */}
                </ButtonGroup>
            </Box>
            <Box className={classes.List}>
                {declarations.map(d => (
                    <DeclrCard {...d} key={d._id} />
                ))}
            </Box>
        </>
    )
}

export default DeclrList;
