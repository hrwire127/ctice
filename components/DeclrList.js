import React, { useState, useEffect, useContext, useRef } from 'react';
import
{
    Box, Typography, ButtonGroup, Button,
    IconButton,
} from '@mui/material';
import { Add } from "@mui/icons-material"
import useStyles from '../assets/styles/_DeclrList'
import AdminContext from './context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import Link from 'next/link'
import TransitionAlerts from './TransitionAlerts'
import { getCountDateQuery, loadLimitedDeclrs } from "../utilsCS/_declr"
import { styleCompact, styleFull } from './context/styleEnum';
import StyleContext from './context/contextStyle'
import SortContext from './context/contextSort'
import useLoading from './hooks/useLoading'
import Search from './Search'
import Sort from './Sort'
import TagFilter from './TagFilter';
import DeclrCardCompact from './DeclrCardCompact';
import DeclrCardFull from './DeclrCardFull';
import DatePicker from './DatePicker'
import handleAsync from './custom/handleAsync'

const DeclrList = (props) => handleAsync(props, (props) =>
{
    const { flash, setFlash, fullTags, setError, Mounted } = props;
    const classes = useStyles();
    const adminCtx = useContext(AdminContext);
    const sortCtx = useContext(SortContext);
    const styleCtx = useContext(StyleContext);

    const [dateValue, setDate] = useState("Invalid");
    const [queryValue, setQuery] = useState("");
    const [declarations, setDeclarations] = useState([]);
    const [count, setCount] = useState(props.count);
    const [sort, setSorting] = useState(sortCtx);
    const [tags, setTags] = useState([]);
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [fullWhile, fullSwitch] = useLoading(true)

    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            //doclimit ---!!!

            const newDeclrs = await loadLimitedDeclrs([], dateValue, queryValue, 4, sort, tags)
            const newCount = await getCountDateQuery(queryValue, dateValue, sort, tags);

            if (newDeclrs.error) return setError(newDeclrs.error)
            if (newCount.error) return setError(newCount.error)

            if (Mounted) 
            {
                setDeclarations(newDeclrs.obj)
                setCount(newCount.obj)
            }
        })
    }, [dateValue, queryValue, sort, tags, Mounted])


    function loadMore(e, date, query, sort, tags)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            //doclimit --!!!!
            const newDeclrs = await loadLimitedDeclrs(declarations, date, query, 5, sort, tags);
            if (newDeclrs.error) return setError(newDeclrs.error)
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
        <>
            {flash && (<TransitionAlerts type={flash.type} setFlash={setFlash}>{flash.message}</TransitionAlerts>)}
            <Search query={queryValue} setQuery={setQuery} />
            <TagFilter fullTags={fullTags} setTags={setTags} />
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
})

export default DeclrList;

