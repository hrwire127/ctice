import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import UserContext from '../components/context/contextUser'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { loadingWhile, timeout, determRendering } from '../utilsCS/_client'
import Loading from '../components/Loading'

function create(props)
{
    let userCtx = React.useContext(UserContext);

    const [alert, setAlert] = useState()
    const [loading, setLoading] = useState(false)

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
        console.log(userCtx)
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        loadingWhile(setLoading, async () =>
        {
            await timeout(500)
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

    return userCtx && (loading
        ? (<Loading fullPage={true} />)
        : (<CreateForm handleSubmit={handleSubmit} alert={alert} />))
}

export default create