import React, { useState, useEffect } from 'react'
import { TextField, Autocomplete, Stack, IconButton } from '@mui/material';
import handleAsync from './custom/handleAsync'


const LocationSearch = (props) => handleAsync(props, (props) =>
{
    const { setLocation, error, onKeyPress, limit, defaultLocation, Mounted } = props
    const [features, setFeatures] = useState(defaultLocation ? [defaultLocation] : [])
    const [query, setQuery] = useState(defaultLocation ? defaultLocation.name : "")


    const sendReq = () =>
    {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=${limit}&proximity=ip&types=place&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
            .then(res => res.json())
            .then(async res => 
            {
                if (Mounted)
                {
                    setFeatures(res.features.map(el =>
                    {
                        return {
                            name: el.place_name,
                            lat: el.geometry.coordinates[1],
                            long: el.geometry.coordinates[0]
                        }
                    }))
                }
            })
    }
    return (
        <Stack spacing={2} sx={{ width: 300, width: "100%" }}>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                defaultValue={defaultLocation ? defaultLocation.name : ""}
                options={features.map(el => el.name)}
                onChange={(event, newValue) => 
                {
                    features.every(f =>
                    {
                        if (f.name === newValue)
                        {
                            setLocation(f)
                            return false;
                        }
                        setLocation()
                        return true;
                    })
                }}
                renderInput={(params) => 
                {
                    return <TextField
                        fullWidth
                        {...params}
                        label="Location"
                        error={error}
                        onKeyPress={onKeyPress}
                        onChange={(e) => 
                        {
                            if (e.target.value === "")
                            {
                                setQuery("")
                                setFeatures([])
                            }
                            else
                            {
                                setQuery(e.target.value)
                                sendReq()
                                setLocation()
                            }
                        }}
                    />
                }}
            />
        </Stack >
    )
})

export default LocationSearch