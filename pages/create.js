import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import UserContext from '../components/context/contextUser'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function create(props)
{
    let userCtx = React.useContext(UserContext);

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
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await timeout(2000)
            await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
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

    return userCtx
        && switchLoading(2, () => <CreateForm handleSubmit={handleSubmit} alert={alert} />)
}

export default create