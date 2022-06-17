import React, { useState } from 'react'
import ReplyCard from './ReplyCard';
import ReplyEdit from './ReplyEdit';

function Reply(props)
{
    const [edit, setEdit] = useState(false)

    const { reply, id, cid, user } = props;

    return edit
        ? (<ReplyEdit
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