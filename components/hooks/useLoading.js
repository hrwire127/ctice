import React, { useState } from 'react';
import Loading from '../Loading'
import {timeout} from "../../utilsCS/_client"

function useLoading(initialValue = false)
{
    const [loading, setLoading] = useState(initialValue)

    const loadingWhile = async (func) =>
    {
        setLoading(true)
        await func();
        setLoading(false)
    }


    const switchLoading = (type, func) =>
    {
        if (loading)
        {
            switch (type)
            {
                case 0:
                    return <Loading center={true} />
                case 1:
                    return <Loading middle={true} />
                case 2:
                    return <Loading full={true} />
                case 3:
                    return <Loading fullPage={true} />

            }
        }
        else
        {
            return func()
        }
    }

    return [loadingWhile, switchLoading]
}

export default useLoading;