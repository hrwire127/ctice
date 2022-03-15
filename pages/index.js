import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';

function index({ declarations })
{
    return (
        <DeclrList declarations={declarations}/>
    )
}

index.getInitialProps = async (props) =>
{
    return { declarations: props.query.declarations }
}

export default index