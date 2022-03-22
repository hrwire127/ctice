import React, { useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import axios from "axios"


function create()
{

    const handleSubmit = async (valBody, body) =>
    {   
        await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
            method: 'POST',
            body: body,
        }).then(async (res) =>
        {
            window.location = await res.text()
        })
    };
    return (
        <CreateForm handleSubmit={handleSubmit} />
    )
}


export default create

