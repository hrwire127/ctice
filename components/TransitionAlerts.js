import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import handleAsync from './custom/handleAsync'

const TransitionAlerts = (props) => handleAsync(props, (props) =>
{
    const { type, setFlash, children, Mounted, floating } = props;
    const [flash, setflash] = useState(children)

    const MainStyle = floating ? {
        position: "absolute",
        top: "-20%",
        width: "100%",
    } : { width: "100%", margin: "0 auto" }

    useEffect(() =>
    {
        if (Mounted && children === flash)
        {
            setflash(flash)
        }
    }, [children, flash, Mounted])

    return (
        <Box sx={MainStyle}>
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
                                }, process.env.ALERT_FADE); //
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