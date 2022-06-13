import React, { useEffect } from 'react'
import { Box, Paper, Toolbar, Typography, Button } from '@mui/material'
import useStyles from "../assets/styles/_NotifWindow"
import CS_Redirects from '../utilsCS/CS_Redirects'
import NotifItem from './NotifItem'

function NotifWindow(props)
{
    const { notifications, setViews, setNotificaions } = props
    const classes = useStyles()

    useEffect(() =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/notifications/seen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window)
                setViews(0)
            })
    }, [])

    const onDelete = (i) =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/notifications/delete/one`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { index: i, secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window)
                setNotificaions(res.obj)
            })
    }

    const onDeleteAll = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/notifications/delete/all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window)
                setNotificaions([])
            })
    }
    
    return (
        <Paper elevation={10} className={classes.Full}>
            {notifications.length > 0
                ? (<>
                    <Button onClick={onDeleteAll} color="error" variant="contained" size="small" >Clear</Button>
                    {notifications.map((n, i) => <NotifItem key={i} raw={n.raw} content={n.content} onDelete={onDelete} index={i} />)}
                </>)
                : (<Typography align="center" color="text.secondary">Nothing</Typography>)
            }
        </Paper>
    )
}

export default NotifWindow