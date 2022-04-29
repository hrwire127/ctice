import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getLimitedDeclrs, timeout, getDeclrsCount } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function index(props)
{
    const { flash, count } = props;
    const [declarations, setDeclarations] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)

    function loadMore(e)
    {
        e.preventDefault()
        loadingWhile(async () =>
        {
            await timeout(2000)
            const newDeclrs = await getLimitedDeclrs(declarations);
            setDeclarations(declarations.concat(newDeclrs.obj));
        })
    }

    return (
        <DeclrList declarations={declarations} flash={flash} loadMore={loadMore} setDeclarations={setDeclarations} switchLoading={switchLoading} loadingWhile={loadingWhile} count={count} />
    )
}

index.getInitialProps = async (props) =>
{
    const flash = props.res ? props.res.locals.flash[0] : undefined
    if (props.res) 
    {
        props.res.locals.flash = []
    }

    // let declrs = await getLimitedDeclrs([]);
    let count = await getDeclrsCount();

    return determRendering(props, () =>
    {
        return { flash, count: count.obj }
    }, () =>
    {
        return { flash, count: count.obj }
    })
}


export default index