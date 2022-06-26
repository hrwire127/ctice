import React, { useState, useEffect } from 'react';

function useWindowSize(value, type)
{
    const [windowSize, setWindowSize] = useState(false);

    useEffect(() =>
    {
        function handleWindowResize()
        {
            // console.log(window.innerWidth)
            let variant;
            switch (type)
            {
                case 0:
                    variant = window.innerWidth < value
                    break;
                case 1:
                    variant = window.innerWidth === value
                    break;
                case 2:
                    variant = window.innerWidth > value
                    break;
            }
            if (variant)
            {
                setWindowSize(true);
            }
            else if (windowSize)
            {
                setWindowSize(false)
            }

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