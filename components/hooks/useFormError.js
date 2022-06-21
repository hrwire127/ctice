import React, { useState } from 'react';

function useFormError(initialValue = false)
{
    const [error, setError] = useState(initialValue)
    const [helperText, setHelperText] = useState('');

    const checkKey = (e, value = true) =>
    {
        setError(false)
        setHelperText('');
        
        if (value && e.key === 'Enter') 
        {
            e.preventDefault()
        }
    }

    const setTrue = () =>
    {
        setHelperText('Looks Fine!')
        setError(false)
    }

    const setFalse = () =>
    {
        setHelperText('Sorry, need to complete this!')
        setError(true)
    }

    const isValid = (value) =>
    {
        if(value)
        {
            return value !== "" 
        }
        return false
    }

    return [error, setError, helperText, setHelperText, checkKey, setTrue, setFalse, isValid]
}

export default useFormError;