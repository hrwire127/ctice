import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrList';
import TransitionAlerts from './TransitionAlerts'
import AdminContext from './context/contextAdmin'
import DatePicker from './DatePicker'
import { getDeclrsDate, getSpecificDeclrs, getDeclrs, getDeclrsTitle, getSpecificDate } from "../utilsCS/_client"

function DeclrList(props)
{
    const { flash } = props;
    const [declarations, setDeclarations] = useState(props.declarations)
    const [value, setValue] = useState("Invalid");

    const classes = useStyles();
    const adminCtx = React.useContext(AdminContext);

    useEffect(() =>
    {
        let element = document.querySelector('.search-query')
        var inputNodes = element.getElementsByTagName('INPUT');
        inputNodes[0].addEventListener('input', async (e) => 
        {
            console.log(value)
            if (value === "Invalid")
            {
                const newDeclrs = await getDeclrsTitle(inputNodes[0].value);
                setDeclarations(newDeclrs)
            }
            else
            {
                const oldDecrls = await getDeclrsDate(getSpecificDate(value))
                const newDeclrs = await getSpecificDeclrs(inputNodes[0].value, oldDecrls);
                setDeclarations(newDeclrs)
            }
        })
    }, [])


    const setTime = async (date) =>
    {
        if (date === "Invalid")
        {
            const declrs = await getDeclrs()
            setDeclarations(declrs.obj)
        }
        else
        {
            setDeclarations(await getDeclrsDate(date))
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
                    <DatePicker setTime={setTime} setValue={setValue} value={value} />
                </Box>
            </Box>
            {
                declarations.length > 0 ?
                    (<Box className={classes.List}>
                        {declarations.map(d => (
                            <DeclrCard {...d} key={d._id} />
                        ))}
                    </Box>)
                    : (<Typography align="center" variant="h5" component="h6" color="text.secondary">Nothing</Typography>)
            }
        </>
    )
}

export default DeclrList;
