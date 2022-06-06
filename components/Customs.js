import React, { useState } from 'react'
import { LightMode, DarkMode, TableRows, Lens, Score, DateRange } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import { sortScore, sortDate } from './context/sortEnum'
import StyleContext from './context/contextStyle'
import SortContext from './context/contextSort'
import CS_Redirects from '../utilsCS/CS_Redirects';

function Customs(props)
{
    const { user, setThemeLight, light, setSortCtx, setStyleCtx } = props;
    const sortCtx = React.useContext(SortContext);
    const styleCtx = React.useContext(StyleContext);
    
    const [theme, setTheme] = useState(light ? 'light' : 'dark');
    const [style, setStyle] = useState(styleCtx);
    const [sort, setSorting] = useState(sortCtx);

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

    const handleStyle = (e, newStyle) =>
    {
        if (newStyle !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/style`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { newStyle, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    setStyleCtx(newStyle)
                    setStyle(newStyle);
                })
        }
    };

    const handleSort = (e, newSort) =>
    {
        if (newSort !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/sort`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { newSort, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    setSortCtx(newSort)
                    setSorting(newSort);
                })
        }
    };


    return (
        <Box>
            <Box>
                <Typography>Theme</Typography>
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
            </Box>

            <Typography>Style</Typography>
            <Box>
                <ToggleButtonGroup
                    value={style}
                    exclusive
                    onChange={handleStyle}
                    aria-label="Card Style"
                >
                    <ToggleButton value="full" aria-label="full">
                        <Lens />
                    </ToggleButton>
                    <ToggleButton value="compact" aria-label="compact">
                        <TableRows />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Typography>Sort</Typography>
            <Box>
                <ToggleButtonGroup
                    value={sort}
                    exclusive
                    onChange={handleSort}
                    aria-label="Sorting"
                >
                    <ToggleButton value={sortDate} aria-label={sortDate}>
                        <DateRange />
                    </ToggleButton>
                    <ToggleButton value={sortScore} aria-label={sortScore}>
                        <Score />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}

export default Customs