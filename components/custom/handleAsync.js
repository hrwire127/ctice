import React, { useState, useEffect } from 'react'

function handleAsync(props, Func)
{
    const [isMounted, setIsMounted] = useState(false);
    let stillMounted = { value: false }

    useEffect(() =>
    {
        setIsMounted(true)
        stillMounted.value = true

        return () => 
        {
            (stillMounted.value = false)
            setIsMounted(false)
        }
    }, [])

    return Func({ ...props, Mounted: isMounted || stillMounted.value })
}

export default handleAsync