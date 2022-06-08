import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import AdminContext from '../components/context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from '../components/hooks/useLoading'
import Rules from "../utilsCS/clientRules"
import useAlertMsg from './hooks/useAlertMsg'

function create(props)
{
	const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [loadingWhile, loadingSwitch] = useLoading(false)

    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        if (!adminCtx) CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
    }, [])

    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setAlertMsg(res.err.message, "error")
                })
        })

    };

    return adminCtx && (<CreateForm setAlert={setAlert} handleSubmit={handleSubmit} alert={alert} loadingSwitch={loadingSwitch} />)
}

export default create

create.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}