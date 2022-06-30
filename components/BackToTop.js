import React, { useState, useEffect } from 'react'
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp, } from '@mui/icons-material';

function BackToTop(props)
{
    const [trigger, setTrigger] = useState(false)
    const triggerValue = 600; 

    // const trigger = useScrollTrigger({
    //     disableHysteresis: true,
    //     threshold: 0.00
    // });


    useEffect(() =>
    {
        const container = document.querySelector('#container')
        if (container)
        {
            console.log(container)
            container.addEventListener('scroll', () =>
            {
                console.log("!")
                if (container)
                {
                    if(container.scrollTop > triggerValue)
                    {
                        setTrigger(true)
                    }
                    else
                    {
                        setTrigger(false)
                    }
                }
            });
        }
    }, []);

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