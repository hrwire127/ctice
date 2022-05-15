import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton, AppBar, CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, MailIcon, Toolbar, ListItemButton } from '@mui/material';
import Link from 'next/link'
import useStyles from '../assets/styles/_NavLayout';
import { getDeclrsDateQuery, timeout, getCountDateQuery } from "../utilsCS/_client"
import { useRouter } from 'next/router'

function NavLayout(props)
{

    const classes = useStyles();

    const Item = (props) =>
    {
        const { text, url, includes } = props
        const router = useRouter();

        const selected = (<>
            <ListItemButton className={classes.ItemButton}>
                <Link href={url}>
                    <ListItemText primary={<Typography color="text.primary" fontWeight="bold">{text}</Typography>} />
                </Link>
            </ListItemButton>
            <Box className={classes.Line}>
            </Box>
        </>)

        const basic = (<ListItemButton>
            <Link href={url}>
                <ListItemText primary={<Typography color="text.primary">{text}</Typography>} />
            </Link >
        </ListItemButton >)

        if (includes)
        {
            return (
                <ListItem key={text} disablePadding>
                    {router.pathname.includes(url)
                        ? selected
                        : basic
                    }
                </ListItem >)
        }
        else
        {
            return (
                <ListItem key={text} disablePadding>
                    {router.pathname === url
                        ? selected
                        : basic
                    }
                </ListItem >)
        }
    }

    const drawer = (
        <List className={classes.DrawerList}>
            <Item text="Home" url="/" />
            <Item text="Login" url="/user/login" />
            <Item text="Profile" url="/user/profile" />
        </List>
    );

    return (
        <Box className={classes.Body}>
            <CssBaseline />
            <Box
                component="nav"
                className={classes.Drawer}
                aria-label="mailbox folders"
            >
                {drawer}
            </Box>
            <Box
                component="main"
                className={classes.Content}
            >
                {props.children}
            </Box>
        </Box>
    )
}

export default NavLayout