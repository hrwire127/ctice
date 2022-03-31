import React from 'react';
import Link from 'next/link'
import DeclrCard from './DeclrCard';

import { makeStyles } from '@mui/styles';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';

const useStyles = makeStyles({
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "90vw",
        margin: "auto",
    },
    Grid: {
        margin: "auto!important",
        width: "90vw!important",
    },
    List: {
        margin: "auto",
        width: "90vw",
        paddingBottom: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gridGap: "20px",
    },
});


function DeclrList(props)
{
    const { declarations } = props;
    const classes = useStyles();

    return (
        <Box>
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
        </Box >
    )
}

export default DeclrList;
