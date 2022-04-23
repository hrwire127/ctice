import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import UserContext from '../../components/context/contextUser'


function edit(props)
{
    const { declaration } = props;
    const { _id } = declaration;

    const userCtx = React.useContext(UserContext);

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
            window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/user/login`
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
            method: 'PUT',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window)
                if (res.err) setError(res.err.message)
            })
    };

    return (
        <>
            {userCtx && (
                <EditForm handleSubmit={handleSubmit} declaration={declaration} alert={alert} />
            )}
        </>
    )
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
        // let globals = getGlobals(props)
        // if (!globals.isAdmin)
        // {
        //     CS_Redirects.Custom_SR(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        // }
        CS_Redirects.tryResSR(declr)
        return { declaration: declr.obj }
    })
}


export default edit


