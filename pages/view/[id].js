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
                if (res.status === "Success")
                {
                    window.location = res.redirect
                }
            })
    }

    return (
        <DeclrView declaration={declaration} onDelete={onDelete} />
    )
}

view.getInitialProps = async ({ query }) =>
{
    const { id } = query;
    const declaration = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}`, {
        method: 'POST',
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
    return { declaration }
}


export default view                                                                           