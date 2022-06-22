import React, { useState } from 'react'
import { Avatar, Button, CssBaseline, Autocomplete, TextField, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';

function TagFilter(props)
{
    const { setTags, fullTags, value = [] } = props

    return (
        <Autocomplete
            sx={{ mt: 2, width: 200}}
            multiple
            id="tags-outlined"
            options={fullTags}
            getOptionLabel={(tag) => tag.content}
            filterSelectedOptions
            value={fullTags.filter(t => value.some(nt => nt._id === t._id))}
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

export default TagFilter