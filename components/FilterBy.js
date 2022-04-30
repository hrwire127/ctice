import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function FilterBy(props)
{
    const [filter, setFilter] = React.useState("");
    const { setDeclarations, declarations } = props;


    const handleChange = (event) =>
    {
        setFilter(event.target.value);
        if (declarations.length > 0) setDeclarations(filterMethod(declarations))
    };

    const filterMethod = (declarations) =>
    {
        let declrs = new Array(...declarations)
        console.log(filter)
        switch (filter)
        {
            case 10:
                declrs.sort(function (a, b)
                {
                    return new Date(b.date[0]) - new Date(a.date[0]);
                })
                break;
            case 20:
                declrs.sort((a, b) => a.title.charAt(0).toLowerCase().localeCompare(b.title.charAt(0).toLowerCase()))
                break;
        }
        console.log(declrs)
        return declrs;
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter}
                    label="Filter"
                    onChange={handleChange}
                >
                    <MenuItem value={20}>Date</MenuItem>
                    <MenuItem value={10}>Title</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default FilterBy