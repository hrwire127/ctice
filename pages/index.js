import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import { getTags } from '../utilsCS/_get'
import useAlertMsg from '../components/hooks/useAlertMsg'

function index(props)
{
    const { fullTags } = props
    const [count, setCount] = useState()
    const [setFlashMsg, flash, setFlash] = useAlertMsg(props.flash)

    useEffect(async () =>
    {
        const newCount = await getAllCount();
        CS_Redirects.tryResCS(newCount, window)
        setCount(newCount)
    }, [])


    return (
        <DeclrList
            count={count}
            flash={flash}
            setFlash={setFlash}
            fullTags={fullTags}
        />
    )
}

index.getInitialProps = async (props) =>
{
    const flash = await getFlash(props)
    const fullTags = await getTags()

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(fullTags, window)
        return { flash, fullTags: fullTags.obj, nav: "Home" }
    }, () =>
    {
        CS_Redirects.tryResSR(fullTags, props)
        return { flash, fullTags: fullTags.obj, nav: "Home" }
    })
}

export default index