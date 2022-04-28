import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getLimitedDeclrs, timeout } from '../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function index(props)
{
    const { flash } = props;
    const [declarations, setDeclarations] = useState(props.declarations)
    const [loadingWhile, switchLoading] = useLoading(true)
    const [count, setCount] = useState(props.count)

    function loadMore(e)
    {
        e.preventDefault()
        loadingWhile(async () =>
        {
            await timeout(2000)
            const newDeclrs = await getLimitedDeclrs(declarations);
            console.log(newDeclrs.obj.list)
            setCount(newDeclrs.obj.count)
            setDeclarations(declarations.concat(newDeclrs.obj.list));
        })
    }

    return (
        <DeclrList declarations={declarations} flash={flash} loadMore={loadMore} setDeclarations={setDeclarations} switchLoading={switchLoading} loadingWhile={loadingWhile} count={count}/>
    )
}

index.getInitialProps = async (props) =>
{
    const flash = props.res ? props.res.locals.flash[0] : undefined
    if (props.res) 
    {
        props.res.locals.flash = []
    }

    let declrs = await getLimitedDeclrs([]);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declrs, window)
        return { flash, declarations: declrs.obj.list, count: declrs.obj.count }
    }, () =>
    {
        CS_Redirects.tryResSR(declrs, props)
        return { flash, declarations: declrs.obj.list, count: declrs.obj.count }
    })
}


export default index