import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering, getFlash } from '../utilsCS/_basic'
import { getAllCount, } from "../utilsCS/_declr"

function index(props)
{
    const { flash, count } = props;

    return (
        <DeclrList
            count={count}
            flash={flash}
        />)
}

index.getInitialProps = async (props) =>
{
    const count = await getAllCount();
    const flash = getFlash(props)

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(count, window)
        return { flash, count: count.obj }
    }, () =>
    {
        CS_Redirects.tryResSR(count, props)
        return { flash, count: count.obj }
    })
}

export default index