import React from 'react'
import { Box, Paper, Toolbar, Typography, Button } from '@mui/material'
import useStyles from "../assets/styles/_NotifWindow"
import NotifItem from './NotifItem'

function NotifWindow(props)
{
    const { notifications } = props
    const classes = useStyles()

    return (
        <Paper elevation={10} className={classes.Full}>
            {notifications.length > 0
                ? (<>
                    <Button color="error" variant="contained" size="small" >Clear</Button>
                    {notifications.map((n, i) => <NotifItem key={i} content={n.content} />)}
                </>)
                : (<Typography align="center" color="text.secondary">Nothing</Typography>)
            }
        </Paper>
    )
}

export default NotifWindow