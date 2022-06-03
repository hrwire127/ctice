import React, { useState, useEffect } from 'react'
import { Box, Button, } from '@mui/material';
import Reply from './Reply';
import useStyles from '../assets/styles/_ReplyList';
import useLoading from './hooks/useLoading'
import { getLimitedReplies, } from '../utilsCS/_get'
import CS_Redirects from '../utilsCS/CS_Redirects'

function ReplyList(props)
{
    const {
        cid,
        id,
        user,
        comment,
        replies,
        setReplies
    } = props;

    const [fullWhile, fullSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)

    const classes = useStyles();

    function loadMore(e)
    {
        if (e) e.preventDefault()
        loadMoreWhile(async () =>
        {
            const newReplies = await getLimitedReplies(replies, cid); //<=
            CS_Redirects.tryResCS(newReplies, window)
            setReplies(replies.concat(newReplies.obj));
        })
    }

    useEffect(() =>
    {
        fullWhile(async () =>
        {
            const newReplies = await getLimitedReplies([], cid, id);
            CS_Redirects.tryResCS(newReplies, window)
            setReplies(newReplies.obj)
        })
    }, [])

    return (<Box className={classes.List}>
        {replies.length > 0
            && (<>
                {fullSwitch(0, () =>
                {
                    return replies.map(r => (
                        <Reply
                            reply={r}
                            cid={cid}
                            id={id}
                            user={user}
                            key={r._id}
                        />))
                })}
                {loadMoreSwitch(0, () => replies.length < comment.replies.length
                    && replies.length > 0
                    && (<Box textAlign="center">
                        <Button onClick={(e) => loadMore(e)}>
                            Load More
                        </Button>
                    </Box>))}
            </>)
        }
    </Box>
    )
}

export default ReplyList;