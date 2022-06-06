import React from 'react'
import { LightMode, DarkMode } from '@mui/icons-material';
import ToggleButton from '@mui/material/ToggleButton';
import CS_Redirects from '../utilsCS/CS_Redirects';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function Customs(props)
{
    const { user, setThemeLight, light } = props;
    const [theme, setTheme] = React.useState(light ? 'light' : 'dark');

    const handleTheme = (e, newTheme) =>
    {
        if (newTheme !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/theme`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { light, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    setThemeLight(res.obj)
                    setTheme(newTheme);
                })
        }
    };

    return (
        <>
            <ToggleButtonGroup
                value={theme}
                exclusive
                onChange={handleTheme}
                aria-label="Theme"
            >
                <ToggleButton value="light" aria-label="light">
                    <LightMode />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="dark">
                    <DarkMode />
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export default Customs