import React, { useState } from 'react'
import ReplyCard from './ReplyCard';
import ReplyEdit from './ReplyEdit';

function Reply(props)
{
    const [edit, setEdit] = useState(false)

    const { reply, id, cid, user, setError } = props;

    return edit
        ? (<ReplyEdit
            cid={cid}
            id={id}
            setError={setError}
            reply={reply}
            setEdit={setEdit}
        />)
        : (<ReplyCard
            setError={setError}
            reply={reply}
            user={user}
            edit={edit}
            cid={cid}
            id={id}
            setEdit={setEdit}
        />)

}

export default Reply