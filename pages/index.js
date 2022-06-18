import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import { getTags } from '../utilsCS/_get'
import useAlertMsg from '../components/hooks/useAlertMsg'
import HomeNavigation from '../components/HomeNavigation'
import Redirects_CS from '../utilsCS/CS_Redirects'
import handleAsync from '../components/custom/handleAsync'

const index = (props) => handleAsync(props, (props) => 
{
    const { count, fullTags, setError, Mounted, } = props
    const [setFlashMsg, flash, setFlash] = useAlertMsg(props.flash)

    return (<HomeNavigation>
        <DeclrList
            setError={setError}
            count={count}
            flash={flash}
            setFlash={setFlash}
            fullTags={fullTags}
        />
    </HomeNavigation>)
})

index.getInitialProps = async (props) =>
{
    if (props.query.error) return { error: props.query.error }

    const flash = await getFlash(props)
    const fullTags = await getTags()
    const count = await getAllCount();

    if (fullTags.error) return { error: fullTags.error }
    if (count.error) return { error: count.error }

    return { flash, fullTags: fullTags.obj, count: count.obj }
}

export default index