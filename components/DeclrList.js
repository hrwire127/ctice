import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrList';
import TransitionAlerts from './TransitionAlerts'
import AdminContext from './context/contextAdmin'
import DatePicker from './DatePicker'
import Loading from './Loading'
import { getDeclrsDate, getSpecificDeclrsTitle, getDeclrs, loadingWhile, getDeclrsDateQuery, timeout } from "../utilsCS/_client"

function DeclrList(props)
{
    const [declarations, setDeclarations] = useState(props.declarations)
    const [dateValue, setDate] = useState("Invalid");
    const [queryValue, setQuery] = useState("");
    const [loading, setLoading] = useState(false)

    const { flash } = props;
    const classes = useStyles();
    const adminCtx = React.useContext(AdminContext);

    useEffect(() =>
    {
        let element = document.querySelector('.search-query')
        var inputNodes = element.getElementsByTagName('INPUT');
        inputNodes[0].addEventListener('input', async (e) => 
        {
            setQuery(inputNodes[0].value)
        })
    }, [])

    useEffect(async () =>
    {
        loadingWhile(setLoading, async () =>
        {
            await timeout(500)
            await setDeclarations(await getDeclrsDateQuery(queryValue, dateValue))
        })
    }, [dateValue, queryValue])

    const Declrs = () =>
    {
        if (loading)
        {
            return <Loading center={true}/>
        }
        else
        {
            return declarations.length > 0 ?
                (<Box className={classes.List}>
                    {declarations.map(d => (
                        <DeclrCard {...d} key={d._id} />
                    ))}
                </Box>)
                : (<Typography align="center" variant="h5" component="h6" color="text.secondary">Nothing</Typography>)
        }
    }

    return (
        <>
            <Link href="/admin">admin</Link>
            <Link href="/welcome">123</Link>
            {flash && (<TransitionAlerts type={flash.type}>{flash.message}</TransitionAlerts>)}
            <Box className={classes.Bar}>
                <Typography variant="h4" >
                    Announcements
                </Typography>
                <Box>
                    {adminCtx &&
                        (<ButtonGroup aria-label="button group">
                            <Link href="/create"><IconButton variant="outlined"><Add /></IconButton></Link>
                        </ButtonGroup>)}
                    <DatePicker setTime={setDate} />
                </Box>
            </Box>
            <Declrs />
        </>
    )
}

export default DeclrList;
