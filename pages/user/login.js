import React, { useState } from 'react'
import Login from '../../components/Login'
import handleError from '../../components/custom/handleError';

const login = (props) => handleError(props, function (props)
{
    return <Login />
})

export default login

login.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}