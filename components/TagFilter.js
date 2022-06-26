import React, { useState, memo } from 'react'
import { Autocomplete, TextField } from '@mui/material';

function TagFilter(props) 
{
    const { setTags, fullTags, value = [] } = props

    const processedValue = fullTags.filter(t => value.some(nt => nt._id === t._id))

    return (
        <Autocomplete
            sx={{ mt: 2, width: 200}}
            multiple
            id="tags-outlined"
            options={fullTags}
            getOptionLabel={(tag) => tag.content}
            filterSelectedOptions
            value={processedValue}
            onChange={(event, value) => setTags(value)}
            renderInput={(params) => (
                <TextField
                    {...params} 
                    variant="standard" 
                    label="Tags"
                    placeholder="Select tags"
                />
            )}
        /> 
    )
}

export default memo(TagFilter)