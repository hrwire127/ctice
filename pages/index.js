import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import { getTags } from '../utilsCS/_get'
import useAlertMsg from '../components/hooks/useAlertMsg'
import handleError from '../components/custom/handleError';
import ErrorPage from '../components/ErrorPage'

const index = (props) => handleError(props, function (props, setError)
{
    const { fullTags } = props
    const [count, setCount] = useState()
    const [setFlashMsg, flash, setFlash] = useAlertMsg(props.flash)

    useEffect(async () =>
    {
        let isMounted = true

        const newCount = await getAllCount();
        if (isMounted)
        {
            if (newCount.error) setError(newCount.error)
            setCount(newCount)
        }
        return () =>
        {
            isMounted = false
        }
    }, [])


    return (
        <DeclrList
            count={count}
            flash={flash}
            setFlash={setFlash}
            fullTags={fullTags}
        />
    )
})

index.getInitialProps = async (props) =>
{
    const flash = await getFlash(props)
    const fullTags = await getTags()

    return determRendering(props, () =>
    {
        if (fullTags.error) return { error: fullTags.error }

        return { flash, fullTags: fullTags.obj, nav: "Home" }
    }, () =>
    {
        if (fullTags.error) return { error: fullTags.error }

        return { flash, fullTags: fullTags.obj, nav: "Home" }
    })
}

export default index