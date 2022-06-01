import React, { useState, useEffect } from 'react'
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel, Button,
    Typography
} from '@mui/material';
import Reply from './Reply';
import useStyles from '../assets/styles/_ReplyList';
import useLoading from './hooks/useLoading'
import { timeout } from '../utilsCS/_basic'
import { getLimitedReplies, } from '../utilsCS/_get'
import CS_Redirects from '../utilsCS/CS_Redirects'

function ReplyList(props)
{
    const {
        _id,
        id,
        user,
        comment,
        loadMore,
        loadMoreSwitch,
        setComments,
        replyWhile,
        switchReply,
        switchComment,
        replies,
        setReplies
    } = props;
    const classes = useStyles();
    const [loadingMoreWhile, loadingMoreSwitch] = useLoading(false)

    useEffect(() =>
    {
        replyWhile(async () =>
        {
            await timeout(500)
            const newReplies = await getLimitedReplies([], _id, id);
            CS_Redirects.tryResCS(newReplies, window)
            setReplies(newReplies.obj)
        })
    }, [])
    return switchReply(0, () =>
    {
        return (<Box className={classes.List}>
            {replies.length > 0
                && (<>
                    {
                        loadingMoreSwitch(0, () =>
                        {
                            return replies.map(r => (
                                <Reply
                                    reply={r}
                                    _id={_id}
                                    id={id}
                                    user={user}
                                    key={r._id}
                                    loadingMoreWhile={loadingMoreWhile}
                                />))
                        })
                    }
                    {
                        loadMoreSwitch(0, () => replies.length < comment.replies.length && replies.length > 0 && (<Box textAlign="center"><Button onClick={(e) => loadMore(e)}>Load More</Button></Box>))
                    }
                </>)
            }
        </Box>)
    })
}

export default ReplyList;