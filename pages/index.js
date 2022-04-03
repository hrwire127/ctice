import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import { serialize } from 'cookie';

function index(props)
{
    const { declarations } = props;
    return (
        <DeclrList declarations={declarations} />
    )
}

index.getInitialProps = async (context) =>
{
    const declarations = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/get`, {
        method: 'POST',
        body: process.env.NEXT_PUBLIC_SECRET
    }).then(response => response.json())
        .then(async res =>
        {
            if (res.confirm === "Success")
            {
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else
            {
                return res;
            }
        })
    return { declarations }
}
export default index