import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, ButtonGroup, Button, Grid, IconButton, AppBar, CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, MailIcon, Toolbar, ListItemButton } from '@mui/material';
import { Add, AutoFixHigh, Backspace } from '@mui/icons-material';
import DeclrCard from './DeclrCard';
import Link from 'next/link'
import useStyles from '../assets/styles/_NavLayout';
import TransitionAlerts from './TransitionAlerts'
import AdminContext from './context/contextAdmin'
import DatePicker from './DatePicker'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getDeclrsDateQuery, timeout, getCountDateQuery } from "../utilsCS/_client"
import { useRouter } from 'next/router'

function NavLayout(props)
{

    const classes = useStyles();
    const drawerWidth = 240;

    const Item = (props) =>
    {
        const { text, url } = props
        const router = useRouter();

        return (
            <ListItem key={text} disablePadding>
                {router.pathname === url ?
                    (<>
                        <ListItemButton className={classes.ItemButton}>
                            <Link href={url}>
                                <ListItemText primary={<Typography fontWeight="bold">{text}</Typography>} />
                            </Link>
                        </ListItemButton>
                        <Box className={classes.Line}>
                        </Box>
                    </>)
                    : (<ListItemButton>
                        <Link href={url}>
                            <ListItemText primary={text} />
                        </Link>
                    </ListItemButton>)
                }
            </ListItem >)
    }

    const drawer = (
        <List className={classes.DrawerList}>
            <Item text="Home" url="/" />
            <Item text="Log in" url="/user/login" />
            <Item text="Sign up" url="/user/register" />
        </List>
    );

    return (
        <Box className={classes.Body}>
            <CssBaseline />
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {drawer}
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {props.children}
            </Box>
        </Box>
    )
}

export default NavLayout