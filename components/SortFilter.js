import React, { useState, useContext } from 'react';
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel,
} from '@mui/material';
import { sortScore, sortDate } from './context/sortEnum'

function SortFilter(props)
{
    const { sort, handleSort } = props

    return (<Box sx={{ display: 'flex', justifyContent: "right" }}>
        <FormControl size="small" sx={{ width: 120, mt: 2, mb: 2 }}>
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort}
                label="Sort"
                onChange={handleSort}
            >
                <MenuItem value={sortDate}>Date</MenuItem>
                <MenuItem value={sortScore}>Score</MenuItem>
            </Select>
        </FormControl>
    </Box>)
}

export default SortFilter