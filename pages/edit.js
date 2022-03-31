import React, { useState } from 'react'
import EditForm from '../components/EditForm';

function edit({ declaration })
{
    const [editorState, setEditorState] = useState();

    const { _id } = declaration;

    const handleSubmit = async (body) =>
    {   
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
            method: 'PUT',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                if (res.status === "Success")
                {
                    window.location = res.redirect
                }
            })
    };

    return (
        <EditForm handleSubmit={handleSubmit} declaration={declaration} setData={setEditorState} editorState={editorState} />
    )
}

edit.getInitialProps = async (props) =>
{
    return { declaration: props.query.declaration }
}

export default edit


