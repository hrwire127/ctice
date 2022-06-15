import React, { useState } from 'react'
import ErrorPage from '../ErrorPage'

function handleError(props, func)
{
    const [error, setError] = useState(props.error)

    return error ? function (props)
    {
        func(props, setError)
        return <ErrorPage message={error.message} status={error.status} />
    }(props) : func(props, setError)
}

export default handleError