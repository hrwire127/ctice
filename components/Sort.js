import React, { useState, useEffect, useContext } from 'react';
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel,
} from '@mui/material';

function Sort(props)
{
    const { sort, handleSort } = props

    return (<Box sx={{ display: 'flex', justifyContent: "right" }}>
        <FormControl sx={{ width: 120, mt: 2, mb: 2 }}>
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort"
                onChange={handleSort}
            >
                <MenuItem value={10}>Date</MenuItem>
                <MenuItem value={20}>Score</MenuItem>
            </Select>
        </FormControl>
    </Box>)
}

export default Sort
