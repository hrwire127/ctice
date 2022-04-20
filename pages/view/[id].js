import React from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { strfyDeclrs, parseDeclrs, getDeclr, determRendering, getGlobals } from '../../utilsCS/_client'


function view(props)                                                                           
{
    const declaration = parseDeclrs(props.declaration);
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
                CS_Redirects.tryResCS(res, window)
            })
    }

    return (
        <DeclrView declaration={declaration} onDelete={onDelete} />
    )
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let res = await getDeclr(id);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(res, window)
        return { declaration: strfyDeclrs(res.obj) }
    }, () =>
    {
        CS_Redirects.tryResSR(res)
        let globals = getGlobals(props)
        return { declaration: strfyDeclrs(res.obj), ...globals }
    })
}



export default view                                                                           