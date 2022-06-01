import React, { useState, useEffect } from 'react'
import { TextField, Autocomplete, Stack, IconButton } from '@mui/material';
import { SettingsBackupRestore } from '@mui/icons-material';


function LocationSearch(props)
{
    const { setLocation, error, onKeyPress, limit, defaultLocation } = props
    const [features, setFeatures] = useState([defaultLocation])
    const [query, setQuery] = useState(defaultLocation ? defaultLocation.name : "")


    const sendReq = () =>
    {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=${limit}&proximity=ip&types=place&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`)
            .then(res => res.json())
            .then(async res => 
            {
                setFeatures(res.features.map(el =>
                {
                    return {
                        name: el.place_name,
                        lat: el.geometry.coordinates[1],
                        long: el.geometry.coordinates[0]
                    }
                }))
            })
    }
    return (
        <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                defaultValue={defaultLocation.name}
                options={features.map(el => el.name)}
                onChange={(event, newValue) => 
                {
                    features.every(f =>
                    {
                        console.log(f.name)
                        console.log(newValue)
                        console.log("\n")
                        if (f.name === newValue)
                        {
                            console.log(true)
                            setLocation(f)
                            return false;
                        }
                        setLocation()
                        return true;
                    })
                    // console.log(event, newValue);
                }}
                renderInput={(params) => 
                {
                    return <TextField
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
}

export default LocationSearch