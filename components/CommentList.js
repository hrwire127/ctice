import React, { useState, useEffect } from 'react'
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel, Button,
    Typography
} from '@mui/material';
import Comment from './Comment';
import SortContext from './context/contextSort'
import useStyles from '../assets/styles/_CommentList';
import useLoading from './hooks/useLoading'
import { getLimitedComments } from '../utilsCS/_get'
import CS_Redirects from '../utilsCS/CS_Redirects'

function CommentList(props)
{
    const sortCtx = React.useContext(SortContext);
    
    const [sort, setSorting] = useState(sortCtx);
    const [isSortBtn, setSortBtn] = useState(true);

    const [fullWhile, fullSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [commentWhile, commentSwitch] = useLoading(false)

    const { comments, user, declaration, setComments } = props;
    const { _id: id } = declaration;

    const classes = useStyles();

    useEffect(() =>
    {
        commentWhile(async () =>
        {
            const newComments = await getLimitedComments([], id, sort);
            CS_Redirects.tryResCS(newComments, window)
            setComments(newComments.obj)
        })
    }, [sort])

    const handleChange = (e) =>
    {
        setSorting(e.target.value);
    };

    function loadMore(e, type)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            const newComments = await getLimitedComments(comments, id, type);
            CS_Redirects.tryResCS(newComments, window)
            setComments(comments.concat(newComments.obj));
        })
    }

    return commentSwitch(0, () =>
    {
        return (<Box className={classes.List}>
            {isSortBtn
                && (<Box sx={{ display: 'flex', justifyContent: "right" }}>
                    <FormControl sx={{ width: 120, mt: 2, mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            label="Sort"
                            onChange={handleChange}
                        >
                            <MenuItem value={"date"}>Date</MenuItem>
                            <MenuItem value={"score"}>Score</MenuItem>
                        </Select>
                    </FormControl>
                </Box>)}
            {comments.length > 0
                ? (<>
                    {
                        fullSwitch(0, () =>
                        {
                            return comments.map(c => (<Comment
                                setSortBtn={setSortBtn}
                                id={id}
                                comment={c}
                                user={user}
                                fullWhile={fullWhile}
                                key={c._id}
                            />))
                        })
                    }
                    {
                        loadMoreSwitch(0, () => comments.length < declaration.comments.length
                            && comments.length > 0
                            && (<Box textAlign="center">
                                <Button onClick={(e) => loadMore(e, sort)}>
                                    Load More
                                </Button>
                            </Box>))
                    }
                </>)
                : (<Typography align="center" component="h1" color="text.secondary" variant="h5" sx={{ fontWeight: 800 }}>
                    . . .
                </Typography>)
            }
        </Box>)
    })
}

export default CommentList;