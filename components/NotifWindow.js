import React, { useEffect } from 'react'
import { Box, Paper, Toolbar, Typography, Button } from '@mui/material'
import useStyles from "../assets/styles/_NotifWindow"
import NotifItem from './NotifItem'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'

const NotifWindow = (props) => handleAsync(props, (props) =>
{
    const { notifications, setViews, setNotificaions, setError, Mounted } = props
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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                if (Mounted)
                {
                    setViews(0)
                }
            })
    }, [Mounted])

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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                setNotificaions([])
            })
    }

    return (
        <Paper elevation={10} className={classes.Full} sx={{p: 1}}>
            <Box sx={{width: "100%", display: 'flex', justifyContent: "space-between", mb: 1}}>
                <Typography variant="h6">Notifications</Typography>
                <Button onClick={onDeleteAll} color="error" variant="contained" size="small" >Clear</Button>
            </Box>

            {notifications.length > 0
                ? (<>
                    {notifications.map((n, i) => <NotifItem key={i} raw={n.raw} content={n.content} onDelete={onDelete} index={i} />)}
                </>)
                : (<Box sx={{ height: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography
                        color="text.secondary"
                    >
                        Nothing
                    </Typography>
                </Box>)
            }
        </Paper>
    )
})

export default NotifWindow