import React from 'react'
import
{
    Paper, Typography, Box, ButtonTypeMap,
    Drawer, CssBaseline, AppBar, Toolbar, List, Divider,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    InboxIcon, MailIcon, Button, IconButton
} from '@mui/material'
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