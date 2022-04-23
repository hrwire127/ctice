import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function index(props)
{
    const { flash, isUser, declarations } = props;

    return (
        <DeclrList declarations={declarations} flash={flash} />
    )
}

index.getInitialProps = async (props) =>
{
    const flash = props.res ? props.res.locals.flash[0] : undefined
    if (props.res) 
    {
        props.res.locals.flash = []
    }

    let declrs = await getDeclrs();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declrs, window)
        return { flash, declarations: declrs.obj}
    }, () =>
    {
        CS_Redirects.tryResSR(declrs)
        return { flash, declarations: declrs.obj }
    })
}


export default index