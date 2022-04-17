import React from 'react'
import DeclrView from '../../components/DeclrView';
// import { UserContext } from '../../components/context/contextUser'


function view(props)                                                                           
{
    const { declaration } = props;
    const { _id } = declaration;

    const onDelete = async (e) =>                                                                           
    {
        e.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(async res =>
            {
                if (res.type === "Home" || res.type === "Error" || res.type === "Login")
                {
                    window.location = res.redirect
                }
            })
    }

    return (
        <DeclrView declaration={declaration} onDelete={onDelete} />
    )
}

view.getInitialProps = async (context) =>
{
    const { id } = context.query;

    const declaration = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            if (res.type === "Error")
            {
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else 
            {
                return res.obj;
            }
        })
    return { declaration }
}



export default view                                                                           