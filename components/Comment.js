import React, { useState } from 'react'
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import CommentCard from './CommentCard';
import CommentEdit from './CommentEdit';
import useLoading from './hooks/useLoading'
import CS_Redirects from '../utilsCS/CS_Redirects'

function Comment(props)
{
    const [edit, setEdit] = useState(false)
    const [alert, setAlert] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)

    const { comment, id } = props;

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }


    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${comment._id}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    return edit
        ? (<CommentEdit comment={comment} handleSubmit={handleSubmit} alert={alert} switchLoading={switchLoading} />)
        : (<CommentCard {...comment} edit={edit} setEdit={setEdit} />)

}

export default Comment