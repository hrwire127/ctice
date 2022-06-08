import React, { useState } from 'react';

function useTimer(initialValue = 0)
{
    const [delay, setDelay] = useState(initialValue)


    const updateTimer = () =>
    {
        if (delay > 0)
        {
            let isMounted = true;

            setTimeout(() => 
            {
                if (isMounted)
                {
                    setDelay((delay - 1))
                }
            }, 1000)

            return () =>
            {
                isMounted = false;
            };
        }
    }


    return [updateTimer, delay, setDelay]
}

export default useTimer;