import React, { useState } from 'react'
import { Avatar, Button, CssBaseline, Autocomplete, TextField, Box, Typography, Container, FormHelperText, IconButton } from '@mui/material';

function TagFilter(props)
{
    const { setTags, fullTags } = props

    return (
        <Autocomplete
            sx={{ mt: 2, width: 200 }}
            multiple
            id="tags-outlined"
            options={fullTags}
            getOptionLabel={(tag) => tag.content}
            filterSelectedOptions
            onChange={(event, value) => setTags(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    placeholder="Select tags"
                />
            )}
        />
    )
}

export default TagFilter