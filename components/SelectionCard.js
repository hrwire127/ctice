import React from 'react'
import { Paper } from '@mui/material'
import { Check } from '@mui/icons-material'
import useStyles from "../assets/styles/_SelectionCard"

function SelectionCard(props)
{
    const { checked, image, setImage } = props
    const classes = useStyles()

    return checked
        ? (<Paper className={classes.ContainerNormal}>
            <div
                alt="Picture"
            />
            <Check
                color="primary"
                className={classes.Check}
            />
        </Paper>)
        : (<Paper
            onClick={() => setImage(image)}
            className={classes.ContainerChecked}
        >
            <div
                alt="Picture"
            />
        </Paper>)
}

export default SelectionCard