import React, { useState, useEffect, useContext } from 'react';
import
{
    Box, Typography, ButtonGroup, Button,
    IconButton,
} from '@mui/material';
import { Add } from "@mui/icons-material"
import useStyles from '../assets/styles/_DeclrList'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import DatePicker from './DatePicker'
import DeclrCardCompact from './DeclrCardCompact';
import DeclrCardFull from './DeclrCardFull';
import Link from 'next/link'
import TransitionAlerts from './TransitionAlerts'
import { getCountDateQuery, loadLimitedDeclrs } from "../utilsCS/_declr"
import { styleCompact, styleFull } from './context/styleEnum';
import Sort from './Sort'
import StyleContext from './context/contextStyle'
import SortContext from './context/contextSort'
import useLoading from './hooks/useLoading'
import Search from './Search'

function DeclrList(props)
{
    const { flash, setFlash } = props;
    const classes = useStyles();
    const adminCtx = useContext(AdminContext);
    const sortCtx = useContext(SortContext);
    const styleCtx = useContext(StyleContext);

    const [dateValue, setDate] = useState("Invalid");
    const [queryValue, setQuery] = useState("");
    const [declarations, setDeclarations] = useState();
    const [count, setCount] = useState(props.count);
    const [sort, setSorting] = useState(sortCtx);
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [fullWhile, fullSwitch] = useLoading(true)


    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            //doclimit ---!!!
            const newDeclrs = await loadLimitedDeclrs([], dateValue, queryValue, 4, sort)
            const newCount = await getCountDateQuery(queryValue, dateValue, sort);
            CS_Redirects.tryResCS(newDeclrs, window)
            CS_Redirects.tryResCS(newCount, window)
            setDeclarations(newDeclrs.obj)
            setCount(newCount)
        })

    }, [dateValue, queryValue, sort])

    function loadMore(e, date, query, sort)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            //doclimit --!!!!
            const newDeclrs = await loadLimitedDeclrs(declarations, date, query, 5, sort);
            CS_Redirects.tryResCS(newDeclrs, window)
            setDeclarations(declarations.concat(newDeclrs.obj));
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
                <Button onClick={(e) => loadMore(e, dateValue, queryValue, sort)}>Load More</Button>
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
        <>
            {flash && (<TransitionAlerts type={flash.type} setFlash={setFlash}>{flash.message}</TransitionAlerts>)}
            <Search query={queryValue} setQuery={setQuery} />
            <Sort handleSort={handleSort} sort={sort} />
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
                <DatePicker setTime={setDate} value={dateValue} />
            </Box>
            <Declrs />
        </>
    )
}

export default DeclrList;
