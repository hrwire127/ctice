import React, { useState } from 'react';
import Rules from "../../utilsCS/clientRules"

function useAlertMsg(initialValue = null)
{
    const [flash, setFlash] = useState(initialValue)

    const setMsg = (message, type) =>
    {
        let isMounted = true;
        setFlash({ type, message })

        setTimeout(() =>
        {
            if (isMounted)
            {
                setFlash()
            }
        }, Rules.form_message_delay);

        return () =>
        {
            isMounted = false;
        };
    }


    return [setMsg, flash, setFlash]
}

export default useAlertMsg;