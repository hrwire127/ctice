import React, { useState } from 'react'
import Register from '../../components/primary/Register'
import HomeNavigation from '../../components/layouts/HomeNavigation'

function register (props)
{
    const { setError } = props

    return (<HomeNavigation>
        <Register setError={setError} />
    </HomeNavigation>)
}

export default register