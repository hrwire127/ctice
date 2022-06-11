import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton, AppBar, CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, MailIcon, Toolbar, ListItemButton } from '@mui/material';
import Link from 'next/link'
import useStyles from '../assets/styles/_NavLayout';
import { useRouter } from 'next/router'
import FixedBanner from "./FixedBanner"
import FullBanner from './FullBanner';

function HomeNavigation(props)
{
    const classes = useStyles();

    const Item = (props) =>
    {
        const { text, url, includes } = props
        const router = useRouter();

        const selected = (<>
            <Link href={url}>
                <ListItemButton className={classes.ItemButton}>
                    <ListItemText primary={<Typography color="text.primary" fontWeight="bold">{text}</Typography>} />
                </ListItemButton>
            </Link>
            <Box className={classes.Line}>
            </Box>
        </>)

        const basic = (
            <Link href={url}>
                <ListItemButton>
                    <ListItemText primary={<Typography color="text.primary">{text}</Typography>} />
                </ListItemButton>
            </Link >)

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

export default HomeNavigation