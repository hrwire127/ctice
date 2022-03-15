import React, { useState } from 'react'
import EditForm from '../components/EditForm';
import axios from "axios"


function edit({ declaration })
{
    const [editorState, setEditorState] = useState();

    const { _id } = declaration;

    const handleSubmit = async (valBody, body) =>
    {
        //const res = await a ...
        //const res = a.then(res => res) ..
        //a.then(res => ...) 

        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/validate`, {
            method: 'POST',
            body: valBody,
            headers: { 'Content-Type': 'application/json' }
        }).then(res =>
        {
            if (res.status === 200)
            {
                fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
                    method: 'PUT',
                    body: body,
                }).then(async (res) =>
                {
                    window.location = await res.text()
                })
                // (body
                //     ? fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
                //         method: 'PUT',
                //         body: body,
                //     })
                //     : fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}/raw`, {
                //         method: 'PUT',
                //         body: valBody,
                //         headers: {
                //             'Content-Type': 'application/json'
                //         }
                //     }))
                //     .then(async (res) =>
                //     {
                //         window.location = await res.text()
                //     })
            }
        })



        // await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: body,
        // }).then((res) =>
        // {
        //     window.location = res.url;
        // })
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


