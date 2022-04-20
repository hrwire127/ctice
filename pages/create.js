import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import UserContext from '../components/context/contextUser'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { strfyDeclrs, parseDeclrs, getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function create(props)
{
    let user = React.useContext(UserContext);

    const [alert, setAlert] = useState()

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
        if (!user)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
            method: 'POST',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                await CS_Redirects.tryResCS(res, window)
                setError(res.err.message)
            })
    };
    return user && (<CreateForm handleSubmit={handleSubmit} alert={alert} />)

}

create.getInitialProps = (props) =>
{
    return determRendering(props, () =>
    {
        return {}
    }, () =>
    {
        let globals = getGlobals(props)
        if (!globals.user)
        {
            CS_Redirects.Custom_SR(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        }
        return { ...globals }
    })
}

export default create