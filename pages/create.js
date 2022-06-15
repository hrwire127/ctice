import React, { useEffect, useState, useContext } from 'react'
import CreateForm from "../components/CreateForm"
import AdminContext from '../components/context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import Rules from "../utilsCS/clientRules"
import useAlertMsg from '../components/hooks/useAlertMsg'
import handleError from '../components/custom/handleError';

const create = (props) => handleError(props, function (props)
{
    const [setAlertMsg, alert, setAlert] = useAlertMsg()

    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        if (!adminCtx) CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
    }, [])

    return adminCtx && (<CreateForm setAlert={setAlert} alert={alert} setAlertMsg={setAlertMsg} />)
})

create.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}

export default create