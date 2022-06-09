import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"
import useAlertMsg from '../components/hooks/useAlertMsg'

function index(props)
{
    const { count } = props;
	const [setFlashMsg, flash, setFlash] = useAlertMsg(props.flash)

    return (
        <DeclrList
            count={count}
            flash={flash}
            setFlash={setFlash}
        />)
}

index.getInitialProps = async (props) =>
{
    const count = await getAllCount();
    const flash = await getFlash(props)

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(count, window)
        return { flash, count: count.obj, nav: "Home"  }
    }, () =>
    {
        CS_Redirects.tryResSR(count, props)
        return { flash, count: count.obj, nav: "Home"  }
    })
}

export default index