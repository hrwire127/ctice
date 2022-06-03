import React, { useState } from 'react'
import CommentCard from './CommentCard';
import CommentEdit from './CommentEdit';
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from '../components/hooks/useLoading'

function Comment(props)
{
    const [edit, setEdit] = useState(false)
    const [fullWhile, fullSwitch] = useLoading(false)

    const {
        comment,
        id,
        user,
        setSortBtn
    } = props;

    const changeEdit = (value) =>
    {
        setSortBtn(!value)
        setEdit(value)
    }

    return fullSwitch(0, () => edit
        ? (<CommentEdit
            id={id}
            comment={comment}
            setEdit={changeEdit}
            fullWhile={fullWhile}
        />)
        : (<CommentCard
            comment={comment}
            user={user}
            setEdit={changeEdit}
            id={id}
            fullWhile={fullWhile}
        />)
    )
}

export default Comment