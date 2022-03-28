import React from 'react'
import DeclrView from '../components/DeclrView';

function view({ declaration })                                                                           
{
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

view.getInitialProps = async (props) =>                                                                           
{
    return { declaration: props.query.declaration }
}

export default view                                                                           