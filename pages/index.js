import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';

function index(props)
{
    const { declarations } = props;
    return (
        <DeclrList declarations={declarations} />
    )
}

index.getInitialProps = async ({ query }) =>
{
    const declarations = await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
        method: 'POST',
    }).then(response => response.json())
        .then(async res =>
        {
            return res;
        })
    return { declarations }
}
export default index