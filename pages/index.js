import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { strfyDeclrs, parseDeclrs, getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function index(props)
{
    const declarations = parseDeclrs(props.declarations);
    const { flash, isUser } = props;

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

    let res = await getDeclrs();

    return determRendering(props, () =>
    {
        CS_Redirects.tryCS(res)
        return { flash, declarations: strfyDeclrs(res.obj)}
    }, () =>
    {
        CS_Redirects.trySR(res)
        let globals = getGlobals(props)
        if (!globals.admin)
        {
            CS_Redirects.Custom_SR(props.res, res.redirect)
        }
        return { flash, declarations: strfyDeclrs(res.obj), ...globals}
    })
}


export default index