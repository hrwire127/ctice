import React, { useState } from 'react';
import Loading from '../Loading'

function useLoading(initialValue = false)
{
    const [loading, setLoading] = useState(initialValue)

    const loadingWhile = async (func) =>
    {
        setLoading(true)
        await func();
        setLoading(false)
    }


    const switchLoading = (func) =>
    {
        if(loading)
        {
            return <Loading fullPage={true} />
        }
        else
        {
            return func()
        }
    }

    return [loadingWhile, switchLoading]
}

export default useLoading;