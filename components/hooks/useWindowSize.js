import React, { useState, useEffect } from 'react';

function useWindowSize()
{
    const [windowSize, setWindowSize] = useState();

    useEffect(() =>
    {
        function handleWindowResize()
        {
            setWindowSize(window.innerWidth);
        }

        handleWindowResize()

        window.addEventListener('resize', handleWindowResize);

        return () =>
        {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    return [windowSize]
}

export default useWindowSize;