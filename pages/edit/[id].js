import React, { useState } from 'react'
import EditForm from '../../components/EditForm';

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
                if (res.confirm === "Success")
                {
                    window.location = res.redirect
                }
            })
    };

    return (
        <EditForm handleSubmit={handleSubmit} declaration={declaration} setData={setEditorState} editorState={editorState} />
    )
}

edit.getInitialProps = async (context) =>
{
    const { id } = context.query;
    const declaration = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/edit/${id}/get`, {
        method: 'POST',
        body: process.env.NEXT_PUBLIC_SECRET
    }).then(response => response.json())
        .then(async res =>
        {
            if (res.confirm === "Success")
            {
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else
            {
                return res;
            }
        })
    return { declaration }
}

export default edit


