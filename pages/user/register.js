import React, { useState } from 'react'
import Register from '../../components/Register'
import handleError from '../../components/custom/handleError';

const register = (props) => handleError(props, function (props)
{
    return (<Register />)
})

register.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}

export default register