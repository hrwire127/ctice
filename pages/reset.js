import React from 'react'
import Welcome from '../components/Welcome'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { loadingWhile, timeout, isToken, determRendering } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'
import Reset from '../components/Reset'

function reset(props)
{
    const { confirmationCode } = props;
    const [loadingWhile, switchLoading] = useLoading(false)

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)

        loadingWhile(async () =>
        {
            timeout(5000)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset`, {
                method: 'POST',
                body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                })
        })
    };
    return switchLoading(2, () => <Reset handleSubmit={handleSubmit} />)
}
reset.getInitialProps = async (props) =>
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
export default reset