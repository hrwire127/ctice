import React from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrList';
import TransitionAlerts from './TransitionAlerts'
import UserContext from '../components/context/currentUser'

function DeclrList(props)
{
    const { declarations, flash } = props;
    const classes = useStyles();
    const user = React.useContext(UserContext);
    return (
        <>
            {flash && (<TransitionAlerts type={flash.type}>{flash.message}</TransitionAlerts>)}
            <Box className={classes.Bar}>
                <Typography variant="h4" >
                    Announcements
                </Typography>
                {user &&
                    (<ButtonGroup aria-label="button group">
                        <Link href="/create"><IconButton variant="outlined"><Add></Add></IconButton></Link>
                    </ButtonGroup>)}
            </Box>
            {
                declarations.length > 0 ?
                    (<Box className={classes.List}>
                        {declarations.map(d => (
                            <DeclrCard {...d} key={d._id} />
                        ))}
                    </Box>)
                    : (<Typography align="center" variant="h5" component="h6" color="text.secondary">Nothing Yet</Typography>)
            }
        </>
    )
}

export default DeclrList;
