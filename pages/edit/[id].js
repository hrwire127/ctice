import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import UserContext from '../../components/context/contextUser'


function edit(props)
{
    const { declaration } = props;
    const { _id } = declaration;
    
    const user = React.useContext(UserContext);

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
                if(res.err) setError(res.err.message)
            })
    };

    return (
        <>
            {user && (
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
        CS_Redirects.tryResSR(declr)
        let globals = getGlobals(props)
        return { declaration: declr.obj, ...globals }
    })
}


export default edit


