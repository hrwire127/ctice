import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import AdminContext from '../components/context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function create(props)
{
    let adminCtx = React.useContext(AdminContext);

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
        if (!adminCtx)
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

    return adminCtx && (<CreateForm handleSubmit={handleSubmit} alert={alert} switchLoading={switchLoading} />)
}

export default create