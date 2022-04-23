import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import UserContext from '../components/context/contextUser'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getGlobals } from '../utilsCS/_client'

function create(props)
{
    let userCtx = React.useContext(UserContext);

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
        if (!userCtx)
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
                CS_Redirects.tryResCS(res, window)
                if(res.err) setError(res.err.message)
            })
    };
    return userCtx && (<CreateForm handleSubmit={handleSubmit} alert={alert} />)

}

create.getInitialProps = (props) =>
{
    return determRendering(props, () =>
    {
        return {}
    }, () =>
    {
        // let globals = getGlobals(props)
        // if (!globals.isAdmin)
        // {
        //     CS_Redirects.Custom_SR(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        // }
        return { }
    })
}

export default create