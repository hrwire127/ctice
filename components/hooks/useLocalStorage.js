import React, { useEffect, useState } from 'react';

const useLocalStorage = (keyName) =>
{
    const [value, setValue] = useState()

    useEffect(() =>
    {
        setValue(JSON.parse(window.localStorage.getItem(keyName)))
    }, [])

    useEffect(() =>
    {
        if (value !== undefined)
        {
            console.log("!")
            window.localStorage.setItem(keyName, JSON.stringify(value))
        }
    }, [value])

    const resetValue = () =>
    {
        window.localStorage.removeItem(keyName)
    }

    return [value, setValue, resetValue];
};

export default useLocalStorage