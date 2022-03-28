import React, { useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import axios from "axios"


function create()
{

    const handleSubmit = async (body) =>
    {
        await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
            method: 'POST',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                if (res.status === "Success")
                {
                    window.location = res.redirect
                }
            })
    };
    return (
        <CreateForm handleSubmit={handleSubmit} />
    )
}


export default create

