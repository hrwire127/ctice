import React, { useState, useEffect, useContext, useReducer } from 'react';
import
{
    Box, Typography, ButtonGroup, Button,
    IconButton, Collapse,
} from '@mui/material';
import { Add, MoreHoriz, Close } from "@mui/icons-material"
import useStyles from '../../assets/styles/_DeclrList'
import Link from 'next/link'
import TransitionAlerts from '../TransitionAlerts'
import Redirects_CS from '../../utilsCS/CS_Redirects'
import { getCountDateQuery, loadLimitedDeclrs } from "../../utilsCS/_declr"
import { styleCompact, styleFull } from '../context/styleEnum';
import StyleContext from '../context/contextStyle'
import SortContext from '../context/contextSort'
import DeviceContext from '../context/contextDevice'
import AdminContext from '../context/contextAdmin'
import useLoading from '../hooks/useLoading'
import useLocalStorage from "../hooks/useLocalStorage"
import declrReducer from "../reducers/declrReducer"
import handleAsync from '../custom/handleAsync'
import Search from '../Search'
import SortFilter from '../SortFilter'
import TagFilter from '../TagFilter';
import DeclrCardCompact from '../DeclrCardCompact';
import DeclrCardFull from '../DeclrCardFull';
import DatePicker from '../DatePicker'


const DeclrList = (props) => handleAsync(props, (props) =>
{
    const { flash, setFlash, fullTags, setError, Mounted } = props;

    const classes = useStyles();
    const adminCtx = useContext(AdminContext);
    const sortCtx = useContext(SortContext);
    const styleCtx = useContext(StyleContext);
    const device = useContext(DeviceContext)

    const [dateValue, setDate] = useLocalStorage("declr_date", 'Invalid', true);
    const [queryValue, setQuery] = useLocalStorage("declr_query", '', true);
    const [tags, setTags] = useLocalStorage("declr_tags", [], true);
    const [open, setOpen] = useLocalStorage("search_open", false, true);
    const [sort, setSorting] = useLocalStorage("sort_declrs", sortCtx, true);
    const [{ declarations, count }, dispatchDeclrs] = useReducer(declrReducer, { declarations: [], count: props.count });

    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [fullWhile, fullSwitch] = useLoading(true)

    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            const newDeclrs = await loadLimitedDeclrs([], dateValue, queryValue, device.doclimit, sort, tags)
            const newCount = await getCountDateQuery(queryValue, dateValue, sort, tags);

            Redirects_CS.handleRes(newDeclrs, typeof window !== "undefined" && window, setError)
            Redirects_CS.handleRes(newCount, typeof window !== "undefined" && window, setError)

            if (Mounted) 
            {
                dispatchDeclrs({ type: "SET", declarations: newDeclrs.obj, count: newCount.obj })
            }
        })
    }, [dateValue, queryValue, sort, tags, Mounted])


    function loadMore(e, date, query, sort, tags)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            //doclimit --!!!!
            const newDeclrs = await loadLimitedDeclrs(declarations, date, query, device.doclimit, sort, tags);
            Redirects_CS.handleRes(newDeclrs, typeof window !== "undefined" && window, setError)

            dispatchDeclrs({ type: "ADD", declarations: newDeclrs.obj })
        })
    }

    const handleSort = (e) =>
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
                <Button onClick={(e) => loadMore(e, dateValue, queryValue, sort, tags)}>Load More</Button>
            </Box>))
    }

    const Declrs = () =>
    {
        return (fullSwitch(0, () => declarations.length > 0
            ? (<>
                <Box className={styleCtx === styleFull ? classes.ListFull : classes.ListCompact}>
                    {declarations.map(d => 
                    {
                        return styleCtx === styleFull
                            ? (<DeclrCardFull {...d} key={d._id} />)
                            : (<DeclrCardCompact {...d} key={d._id} />)
                    }
                    )}
                </Box>
                <LoadMoreBtn />
            </>)
            : (<Typography align="center" variant="h5" component="h6" color="text.secondary">Nothing</Typography>)))
    }


    return (
        <Box
            component="main"
            className={classes.Container}
        >
            {flash && (<TransitionAlerts type={flash.type} setFlash={setFlash}>{flash.message}</TransitionAlerts>)}
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
                <SortFilter handleSort={handleSort} sort={sort} />
            </Box>
            <Box sx={{ textAlign: "center" }}>
                <IconButton onClick={() => setOpen(!open)}>{open ? (<Close />) : (<MoreHoriz />)}</IconButton>
                <Collapse in={open} >
                    <Box sx={{
                        width: "100%",
                        display: 'flex',
                        justifyContent: "space-evenly",
                        alignItems: "end",
                        flexWrap: "wrap",
                        rowGap: 2
                    }}>
                        <Search query={queryValue} setQuery={setQuery} />
                        <TagFilter fullTags={fullTags} setTags={setTags} value={tags} />
                        <DatePicker setTime={setDate} value={dateValue} />
                    </Box>
                </Collapse>
            </Box>
            <Declrs />
        </Box>
    )
})

export default DeclrList