import React, { useState } from 'react'
import CommentCard from './CommentCard';
import CommentEdit from './CommentEdit';
import useLoading from './hooks/useLoading'
import CS_Redirects from '../utilsCS/CS_Redirects'

function Comment(props)
{
    const [edit, setEdit] = useState(false)
    const [alert, setAlert] = useState()
    const [submitWhile, submitSwitch] = useLoading(false)

    const { comment, id, loadingMoreWhile, user } = props;

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
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${comment._id}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    loadingMoreWhile(() =>
                    {
                        CS_Redirects.tryResCS(res, window)
                        if (res.err) setError(res.err.message)
                    })
                })
        })

    };

    const handleDelete = async () =>
    {
        submitWhile(async () =>
        {
            await timeout(3000)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${comment._id}`, {
                method: 'DELETE',
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    return edit
        ? (<CommentEdit
            comment={comment}
            handleSubmit={handleSubmit}
            alert={alert}
            submitSwitch={submitSwitch}
        />)
        : (<CommentCard
            {...comment}
            user={user}
            edit={edit}
            setEdit={setEdit}
            handleDelete={handleDelete}
        />)

}

export default Comment