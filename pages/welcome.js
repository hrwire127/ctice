import React from 'react'
import Welcome from '../components/Welcome'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { isToken, determRendering, getGlobals } from '../utilsCS/_client'
import { loadingWhile, timeout, determRendering } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function welcome(props)
{
    const { confirmationCode } = props;
    const [loadingWhile, switchLoading] = useLoading(false)

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)

        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/confirm`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                })
        })
    };

    return userCtx && switchLoading(2, () => <Welcome handleSubmit={handleSubmit} />)
}

welcome.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST, window)
    }, () =>
    {
        const { confirmationCode } = props.query;

        return isToken(confirmationCode, () =>
        {
            return { confirmationCode, }
        }, props.res)
    })
}
export default welcome