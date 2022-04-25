import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import UserContext from '../../components/context/contextUser'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclr, determRendering, getGlobals, loadingWhile, timeout } from '../../utilsCS/_client'
import useLoading from '../../components/hooks/useLoading'

function edit(props)
{
    const { declaration } = props;
    const { _id } = declaration;

    const userCtx = React.useContext(UserContext);

    const [alert, setAlert] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await timeout(500)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })
    };

    return userCtx
        && switchLoading(2, () => <EditForm handleSubmit={handleSubmit} declaration={declaration} alert={alert} />)
}

edit.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(declr)
        return { declaration: declr.obj }
    })
}


export default edit