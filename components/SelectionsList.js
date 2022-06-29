import React from 'react'
import { Box } from '@mui/material'
import useStyles from '../assets/styles/_SelectionsList'
import SelectionCard from './SelectionCard'

function SelectionsList(props)
{
    const { selections, setImage, image } = props

    const classes = useStyles(props)()
    return (
        <Box className={classes.SelectionsFull}>
            <Box className={classes.SelectionsGrid}>
                {selections.map((p, i) => <SelectionCard key={i} setImage={setImage} image={p} checked={image === p ? true : false} />)}
            </Box>
        </Box>
    )
}

export default SelectionsList