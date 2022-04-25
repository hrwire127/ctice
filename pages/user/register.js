import React, { useState } from 'react'
import Register from '../../components/Register'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclr, determRendering, getGlobals, loadingWhile, timeout } from '../../utilsCS/_client'
import useLoading from '../components/hooks/useLoading'

function register(props)
{
	const [alert, setAlert] = useState()
	const [loadingWhile, switchLoading] = useLoading(false)

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
		loadingWhile(async () =>
		{
			await timeout(500)
			await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/register`, {
				method: 'POST',
				body: body,
			}).then(response => response.json())
				.then(async res =>
				{
					CS_Redirects.tryResCS(res, window);
					if (res.err) setError(res.err.message)
				})
		})
	};

	return userCtx
		&& switchLoading(() => <Register handleSubmit={handleSubmit} alert={alert} />)
}

export default register
