import React from 'react';
import { Alert, Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrList';
import { UserContext } from '../components/context/currentUser'

function DeclrList(props)
{
    const { declarations, flash } = props;
    const classes = useStyles();
    return (
        <>
            {flash && (<Alert severity={flash.type}>{flash.message}</Alert>)}
            <UserContext.Consumer>
                {value => value && (<Typography>User Logged In</Typography>)}
            </UserContext.Consumer>

            <Box className={classes.Bar}>
                <Typography variant="h4" >
                    Announcements
                </Typography>
                <UserContext.Consumer>
                    {value => value &&
                        (<ButtonGroup aria-label="button group">
                            <Link href="/create"><IconButton variant="outlined"><Add></Add></IconButton></Link> 
                        </ButtonGroup>)}
                </UserContext.Consumer>

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
