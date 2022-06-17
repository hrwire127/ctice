import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import handleAsync from './custom/handleAsync'

const TransitionAlerts = (props) => handleAsync(props, (props) =>
{
    const { type, setFlash, children, Mounted } = props;
    const [flash, setflash] = useState(children)

    useEffect(() =>
    {
        if (Mounted)
        {
            if (children === flash)
            {
                setflash(flash)
            }
        }
    }, [children, flash])

    return (
        <Box sx={{ width: "100%", margin: "0 auto" }}>
            <Collapse in={flash ? true : false}>
                <Alert
                    severity={type}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() =>
                            {
                                setflash()
                                setTimeout(() =>
                                {
                                    setFlash()
                                }, 1000);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {children}
                </Alert>
            </Collapse>
        </Box>
    );
})

export default TransitionAlerts