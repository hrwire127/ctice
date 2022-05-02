import React, { useState } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { loadingWhile, timeout, determRendering, getDeclr } from '../../utilsCS/_client'
import useLoading from '../../components/hooks/useLoading'


function view(props)                                                                           
{
    const { declaration } = props;
    const { _id } = declaration;
    const [alert, setAlert] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)
    const [loadingWhileContent, switchLoadingContent] = useLoading(false)

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const onDelete = async (e) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await timeout(500)
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
        })

    }

    const handleSubmit = async (body) =>
    {
        loadingWhileContent(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/comment/${_id}`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    return switchLoading(2, () => <DeclrView declaration={declaration} onDelete={onDelete} switchLoading={switchLoadingContent} alert={alert} handleSubmit={handleSubmit} />)
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        return { declaration: declr.obj }
    })
}



export default view                                                                           