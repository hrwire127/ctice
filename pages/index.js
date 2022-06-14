import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import useAlertMsg from '../components/hooks/useAlertMsg'

function index(props)
{
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
        />
    )
}

index.getInitialProps = async (props) =>
{
    const flash = await getFlash(props)

    return determRendering(props, () =>
    {
        return { flash, nav: "Home" }
    }, () =>
    {
        return { flash, nav: "Home" }
    })
}

export default index