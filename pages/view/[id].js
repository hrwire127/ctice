import React from 'react'
import DeclrView from '../../components/DeclrView';


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
                if (res.confirm === "Success")
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
    const declaration = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/get`, {
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


export default view                                                                           