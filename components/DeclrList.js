import React, { useState, useEffect, useRef } from 'react';
import
{
    Box, Typography, ButtonGroup, Button, Grid,
    IconButton, AppBar, CssBaseline, Divider, Drawer,
    List, ListItem, ListItemIcon, ListItemText, MailIcon,
    Toolbar, ListItemButton, MenuItem, FormControl,
    Select, InputLabel,
} from '@mui/material';
import DeclrCard from './DeclrCard';
import useStyles from '../assets/styles/_DeclrList'
import AdminContext from './context/contextAdmin'
import Link from 'next/link'
import { Add } from "@mui/icons-material"
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout } from "../utilsCS/_basic"
import { getCountDateQuery, loadLimitedDeclrs } from "../utilsCS/_declr"
import DatePicker from './DatePicker'
import TransitionAlerts from './TransitionAlerts'

function DeclrList(props)
{
    const [dateValue, setDate] = useState("Invalid");
    const [queryValue, setQuery] = useState("");
    const [count, setCount] = useState(props.count);
    const [sort, setSorting] = React.useState(10);

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
            //doclimit ---!!!
            const newDeclrs = await loadLimitedDeclrs([], dateValue, queryValue, 4, sort)
            const newQuery = await getCountDateQuery(queryValue, dateValue, 4, sort);
            CS_Redirects.tryResCS(newDeclrs, window)
            CS_Redirects.tryResCS(newQuery, window)
            setDeclarations(newDeclrs)
            setCount(newQuery)
        })

    }, [dateValue, queryValue, sort])

    const handleChange = (e) =>
    {
        setSorting(e.target.value);
    };

    const LoadMoreBtn = () =>
    {
        return loadMoreSwitch(0, () => count > declarations.length &&
            (<Box
                display="flex"
                justifyContent="center"
            >
                <Button onClick={(e) => loadMore(e, dateValue, queryValue, sort)}>Load More</Button>
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
            <Box sx={{ display: 'flex', justifyContent: "right" }}>
                <FormControl sx={{ width: 120, mt: 2, mb: 2 }}>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Sort"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Date</MenuItem>
                        <MenuItem value={20}>Score</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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
