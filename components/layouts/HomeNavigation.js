import React, { useState, useRef, useEffect } from 'react'
import
{
    Button, Box,
    Typography, CssBaseline,
    List, ListItem,
    ListItemText, ListItemButton,
    SwipeableDrawer, IconButton
} from '@mui/material'
import Link from 'next/link'
import useStyles from '../../assets/styles/_NavLayout'
import { useRouter } from 'next/router'
import useWindowSize from '../hooks/useWindowSize'
import BackToTop from '../BackToTop'

function HomeNavigation(props)
{
    const [swipeOpen, setSwipeOpen] = useState(false);
    const [windowMinSize] = useWindowSize(830, 0);

    const classes = useStyles();

    useEffect(() =>
    {
        const menuBtn = document.querySelector("#menu-btn")
        menuBtn.addEventListener('click', () => setSwipeOpen(!swipeOpen))
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
            {/* <Item text="Profile" url="/user/profile" /> */}
        </List>
    );

    return <Box className={classes.Body}>
        {!windowMinSize && (<CssBaseline />)}
        {windowMinSize
            ? (<SwipeableDrawer
                open={swipeOpen}
                onClose={() => setSwipeOpen(false)}
                onOpen={() => setSwipeOpen(true)}
            >
                <Box
                    component="nav"
                    className={classes.Drawer}
                    aria-label="mailbox folders"
                >
                    {drawer}
                </Box>
            </SwipeableDrawer>)
            : (<Box
                component="nav"
                className={classes.Drawer}
                aria-label="mailbox folders"
            >
                {drawer}
            </Box>)
        }
        <Box
            className={classes.Main}
            id="container"
        >
            <Box id="back-to-top-anchor" />
            {props.children}
            <BackToTop />
        </Box>
    </Box >
}

export default HomeNavigation