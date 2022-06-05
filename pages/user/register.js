import React, { useState } from 'react'
import Register from '../../components/Register'

function register(props)
{
	return (<Register />)
}

export default register

register.getInitialProps = async (props) =>
{
    return { nav: "Home" }
}