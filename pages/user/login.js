import React, { useState } from 'react'
import Login from '../../components/Login'
import HomeNavigation from '../../components/layouts/HomeNavigation'

function login (props) 
{
    const { setError } = props
    return <HomeNavigation>
        <Login setError={setError} />
    </HomeNavigation>
}

export default login