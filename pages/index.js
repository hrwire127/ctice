import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import { getTags } from '../utilsCS/_get'
import useAlertMsg from '../components/hooks/useAlertMsg'
import HomeNavigation from '../components/HomeNavigation'

function index (props) 
{
    const { fullTags, setError } = props
    const [count, setCount] = useState()
    const [setFlashMsg, flash, setFlash] = useAlertMsg(props.flash)


    useEffect(async () =>
    {
        const newCount = await getAllCount();
        if (newCount.error) return setError(newCount.error)

        setCount(newCount.obj)
    }, [])


    return (<HomeNavigation>
        <DeclrList
            setError={setError}
            count={count}
            flash={flash}
            setFlash={setFlash}
            fullTags={fullTags}
        />
    </HomeNavigation>)
}

index.getInitialProps = async (props) =>
{
    const flash = await getFlash(props)
    const fullTags = await getTags()

    return determRendering(props, () =>
    {
        if (fullTags.error) return { error: fullTags.error }

        // return { error: { message: "3434", status: 410 } }
        return { flash, fullTags: fullTags.obj }
    }, () =>
    {
        if (fullTags.error) return { error: fullTags.error }

        // return { error: { message: "3434", status: 410 } }
        return { flash, fullTags: fullTags.obj }
    })
}

export default index