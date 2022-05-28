import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, loadLimitedDeclrs, timeout, getAllCount, getFlash } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function index(props)
{
    const { flash, count } = props;
    const [declarations, setDeclarations] = useState()
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [fullWhile, fullSwitch] = useLoading(true)

    function loadMore(e, date, query, sort)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            await timeout(500)
            //doclimit --!!!!
            const newDeclrs = await loadLimitedDeclrs(declarations, date, query, 5, sort);
            console.log(newDeclrs)
            CS_Redirects.tryResCS(newDeclrs, window)
            setDeclarations(declarations.concat(newDeclrs.obj));
        })
    }

    return (
        <DeclrList
            declarations={declarations}
            count={count}
            flash={flash}
            loadMore={loadMore}
            setDeclarations={setDeclarations}
            loadMoreSwitch={loadMoreSwitch}
            fullWhile={fullWhile}
            fullSwitch={fullSwitch}
        />
    )
}

index.getInitialProps = async (props) =>
{
    let count = await getAllCount();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(count, window)
        return { flash: getFlash(props), count: count.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(count, props)
        return { flash: getFlash(props), count: count.obj }
    })
}


export default index