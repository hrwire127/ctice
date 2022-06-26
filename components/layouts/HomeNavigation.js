import React, { useState, useRef, useEffect } from 'react';
import
{
    Button, Box,
    Typography, CssBaseline,
    List, ListItem,
    ListItemText, ListItemButton,
    SwipeableDrawer, IconButton
} from '@mui/material';
import Link from 'next/link'
import useStyles from '../../assets/styles/_NavLayout';
import { useRouter } from 'next/router'
import FixedBanner from "../FixedBanner"
import FullBanner from '../FullBanner';
import useWindowSize from '../hooks/useWindowSize';

function HomeNavigation(props)
{
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [windowMinSize] = useWindowSize(830, 0);

    useEffect(() =>
    {
        const menuBtn = document.querySelector("#menu-btn")
        menuBtn.addEventListener('click', () => setOpen(!open))
    }, []);

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
            <Item text="Register" url="/user/register" />
            <Item text="Profile" url="/user/profile" />
        </List>
    );

    return windowMinSize
        ? (<Box className={classes.SwipeContainer}>
            <SwipeableDrawer
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Box
                    component="nav"
                    className={classes.Drawer}
                    aria-label="mailbox folders"
                >
                    {drawer}
                </Box>
            </SwipeableDrawer>

            {props.children}
        </Box>)
        : (<Box className={classes.Body}>
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
        </Box >)
}

export default HomeNavigation