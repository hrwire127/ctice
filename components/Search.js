import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton, Tooltip } from '@mui/material'
import { Clear } from '@mui/icons-material'
import useStyles from '../assets/styles/_Search'

function Search(props)
{
    const { query, setQuery } = props;

    const classes = useStyles()

    return (
        <Tooltip title="Use [tag] or [tag1, tag2] to search tags">
            <TextField
                className={`${classes.Search} search-query`}
                variant="standard"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end" sx={query === "" ? { display: "none" } : {}}>
                            <IconButton
                                className="query-clear"
                                onClick={() =>
                                {
                                    setQuery("")
                                }}
                                edge="end"
                            >
                                <Clear color="primary" />
                            </IconButton>
                        </InputAdornment>
                }}

            />
        </Tooltip>
    )
}

export default Search