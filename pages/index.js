import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getLimitedDeclrs, timeout, getAllCount } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function index(props)
{
    const { flash, count } = props;
    const [declarations, setDeclarations] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)

    function loadMore(e, date, query)
    {
        e.preventDefault()
        console.log(date)
        console.log(query)
        loadingWhile(async () =>
        {
            await timeout(2000)
            const newDeclrs = await getLimitedDeclrs(declarations, date, query);
            console.log(newDeclrs)
            CS_Redirects.tryResCS(newDeclrs, window)
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

    let count = await getAllCount();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(count, window)
        return { flash, count: count.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(count, props)
        return { flash, count: count.obj }
    })
}


export default index