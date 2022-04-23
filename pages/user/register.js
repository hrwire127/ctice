import React, { useState } from 'react'
import Register from '../../components/Register'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering, getGlobals } from '../../utilsCS/_client'

function register(props)
{
	const [alert, setAlert] = useState()

	const setError = (msg) => 
	{
		setAlert(msg)
		setTimeout(() =>
		{
			setAlert()
		}, 9000);
	}

	const handleSubmit = async (body) =>
	{
		await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/register`, {
			method: 'POST',
			body: body,
		}).then(response => response.json())
			.then(async res =>
			{
				CS_Redirects.tryResCS(res, window);
				if (res.err) setError(res.err.message)
			})
	};
	return (
		<Register handleSubmit={handleSubmit} alert={alert} />
	)
}

register.getInitialProps = async (props) =>
{
	return {}
}


export default register
