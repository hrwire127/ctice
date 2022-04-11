import React, { useState } from 'react'
import Register from '../../components/Register'

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
        if (res.type === "Client" || res.type === "Error")
        {
          window.location = res.redirect
        }
        else if (res.type === "Api")
        {
          setError(res.obj.err.message)
        }
      })
  };
  return (
    <Register handleSubmit={handleSubmit} alert={alert} />
  )
}

export default register