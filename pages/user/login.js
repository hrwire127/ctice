import React, { useState } from 'react'
import Login from '../../components/Login'

function login(props)
{
    return <Login />
}

export default login

login.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}