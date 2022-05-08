import React, { useState } from 'react'
import Login from '../../components/Login'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import useLoading from '../../components/hooks/useLoading'
import { useRouter } from 'next/router'

function login(props)
{
    const [alert, setAlert] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)
    const router = useRouter()

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.err) setError(res.err.message)
                    window.location = document.referrer;
                    // window.history.go(-1);
                    // CS_Redirects.tryResCS(res, window);
                    // if (res.err) setError(res.err.message)
                })
        })
    };

    return (<Login handleSubmit={handleSubmit} alert={alert} switchLoading={switchLoading} />)
    // switchLoading(2, () => )
}


export default login
