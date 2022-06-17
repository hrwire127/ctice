import React, { useState } from 'react'
import Register from '../../components/Register'
import HomeNavigation from '../../components/HomeNavigation'

function register (props)
{
    const { setError } = props

    return (<HomeNavigation>
        <Register setError={setError} />
    </HomeNavigation>)
}

export default register