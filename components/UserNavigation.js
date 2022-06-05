import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, CssBaseline, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import Link from 'next/link'
import useStyles from '../assets/styles/_NavLayout';
import { useRouter } from 'next/router'
import { Info, Palette, Edit, Bookmarks, Close } from '@mui/icons-material';

function UserNavigation(props)
{
    const classes = useStyles();

    const Item = (props) =>
    {
        const { text, url, includes, icon } = props
        const router = useRouter();

        const ItemIcon = () =>
        {
            switch (icon)
            {
                case "Info":
                    return <Info />
                case "Customs":
                    return <Palette />
                case "Edit":
                    return <Edit />
                case "Bookmarks":
                    return <Bookmarks />
            }
        }

        const selected = (<>
            <Link href={url}>
                <ListItemButton className={classes.ItemButton}>
                    <ListItemIcon>
                        <ItemIcon />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="text.primary" fontWeight="bold">{text}</Typography>} />
                </ListItemButton>
            </Link>
            <Box className={classes.Line}>
            </Box>
        </>)

        const basic = (
            <Link href={url}>
                <ListItemButton>
                    <ListItemIcon>
                        <ItemIcon />
                    </ListItemIcon>
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
            <Item text="Info" url="/user/profile" icon="Info" />
            <Item text="Edit" url="/user/profile/edit" icon="Edit" />
            <Item text="Bookmarks" url="/user/profile/bookmarks" icon="Bookmarks" />
            <Item text="Customs" url="/user/profile/customs" icon="Customs" />
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
                <Box display="flex" justifyContent="center">
                    <Link href="/">
                        <IconButton>
                            <Close />
                        </IconButton>
                    </Link>
                </Box>
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

export default UserNavigation