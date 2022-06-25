import React from 'react'
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp, } from '@mui/icons-material';

function BackToTop(props)
{
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = event =>
    {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );

        if (anchor)
        {
            anchor.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <Zoom in={trigger}>
            <div style={{ position: "fixed", bottom: "10%", right: "10%" }} onClick={handleClick} role="presentation">
                <Fab color="primary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUp />
                </Fab>
            </div>
        </Zoom>
    );
}

export default BackToTop