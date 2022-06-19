import React, { useEffect, useState } from 'react';

const useLocalStorage = (keyName, initial = undefined, noNull = false) =>
{
    const [value, setValue] = useState(initial)

    useEffect(() =>
    {
        // window.localStorage.clear()
        if (noNull)
        {
            const storageValue = JSON.parse(window.localStorage.getItem(keyName))
            if (storageValue !== null && storageValue !== undefined)
            {
                setValue(storageValue)
            }
        }
        else
        {
            const storageValue = JSON.parse(window.localStorage.getItem(keyName))
            setValue(storageValue)
        }
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