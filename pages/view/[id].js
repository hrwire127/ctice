import React from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { loadingWhile, timeout, determRendering } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'


function view(props)                                                                           
{
    const { declaration } = props;
    const { _id } = declaration;
    const [loadingWhile, switchLoading] = useLoading(false)


    const onDelete = async (e) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await timeout(500)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                })
        })

    }

    return userCtx
        && switchLoading(() => <DeclrView declaration={declaration} onDelete={onDelete} />)
}

view.getInitialProps = async (props) =>
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
        return { declaration: declr.obj }
    })
}



export default view                                                                           