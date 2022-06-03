import React, { useState } from 'react'
import ReplyCard from './ReplyCard';
import ReplyEdit from './ReplyEdit';

function Reply(props)
{
    const [edit, setEdit] = useState(false)

    const { reply, id, cid, user } = props;

    return edit
        ? (<ReplyEdit
            reply={reply}
            setEdit={setEdit}
        />)
        : (<ReplyCard
            reply={reply}
            user={user}
            edit={edit}
            cid={cid}
            id={id}
            setEdit={setEdit}
        />)

}

export default Reply