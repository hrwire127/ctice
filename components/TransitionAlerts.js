import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function TransitionAlerts(props)
{
    const { type, setFlash, children } = props;
    const [flash, setflash] = useState(children)

    useEffect(() =>
    {
        console.log("!")
        if (children === flash)
        {
            setflash(flash)
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
                                setFlash()
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
}