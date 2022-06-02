import React, { useState } from 'react'
import Welcome from '../components/Welcome'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { loadingWhile, timeout, isResetToken, determRendering } from '../utilsCS/_basic'
import useLoading from '../components/hooks/useLoading'


function welcome(props)
{
    const { confirmationCode } = props;

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

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)

        loadingWhile(async () =>
        {
            timeout(5000)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/register`, {
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

    return switchLoading(2, () => <Welcome handleSubmit={handleSubmit} alert={alert} switchLoading={switchLoading} />)

}

welcome.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST, window)
        return {}
    }, () =>
    {
        const { confirmationCode } = props.query;

        return { confirmationCode }
    })
}
export default welcome