import React, { useState, useEffect, useRef } from 'react';
import
{
    Box, Typography, ButtonGroup, Button, Grid,
    IconButton, AppBar, CssBaseline, Divider, Drawer,
    List, ListItem, ListItemIcon, ListItemText, MailIcon,
    Toolbar, ListItemButton, TransitionAlerts
} from '@mui/material';
import DeclrCard from './DeclrCard';
import useStyles from '../assets/styles/_DeclrList'
import AdminContext from './context/contextAdmin'
import Link from 'next/link'
import { Add } from "@mui/icons-material"
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getDeclrsDateQuery, timeout, getCountDateQuery } from "../utilsCS/_client"
import DatePicker from './DatePicker'


function DeclrList(props)
{
    const [dateValue, setDate] = useState("Invalid");
    const [queryValue, setQuery] = useState("");
    const [count, setCount] = useState(props.count);

    const { flash,
        loadMore,
        declarations,
        setDeclarations,
        loadMoreSwitch,
        fullWhile,
        fullSwitch } = props;
    const classes = useStyles();
    const adminCtx = React.useContext(AdminContext);

    useEffect(() =>
    {
        const element = document.querySelector('.search-query')
        var inputNodes = element.getElementsByTagName('INPUT');
        inputNodes[0].addEventListener('input', async () => 
        {
            setQuery(inputNodes[0].value)
        })
        const btn = document.querySelector('.query-clear')
        btn.onclick = function (e)  
        {
            setQuery("")
        }
    }, [])

    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            await timeout(500)
            const newDeclrs = await getDeclrsDateQuery(queryValue, dateValue);
            const newQuery = await getCountDateQuery(queryValue, dateValue);
            CS_Redirects.tryResCS(newDeclrs, window)
            CS_Redirects.tryResCS(newQuery, window)
            setDeclarations(newDeclrs)
            setCount(newQuery)
        })

    }, [dateValue, queryValue])


    const LoadMoreBtn = () =>
    {
        return loadMoreSwitch(0, () => count > declarations.length &&
            (<Box
                display="flex"
                justifyContent="center"
            >
                <Button onClick={(e) => loadMore(e, dateValue, queryValue)}>Load More</Button>
            </Box>))

    }

    const Declrs = () =>
    {
        return (fullSwitch(0, () => declarations.length > 0
            ? (<>
                <Box className={classes.List}>
                    {declarations.map(d => (
                        <DeclrCard {...d} key={d._id} />
                    ))}
                </Box>
                <LoadMoreBtn />
            </>)
            : (<Typography align="center" variant="h5" component="h6" color="text.secondary">Nothing</Typography>)))
    }

    return (
        <>
            {flash && (<TransitionAlerts type={flash.type}>{flash.message}</TransitionAlerts>)}
            <Box className={classes.Bar}>
                <Typography variant="h4">
                    Announcements
                </Typography>
                <Box>
                    {adminCtx &&
                        (<ButtonGroup aria-label="button group">
                            <Link href="/create"><IconButton variant="outlined"><Add /></IconButton></Link>
                        </ButtonGroup>)}
                </Box>
                <DatePicker setTime={setDate} />
            </Box>
            <Declrs />
        </>
    )
}

export default DeclrList;
