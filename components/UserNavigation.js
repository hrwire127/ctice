import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, IconButton, CssBaseline, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import Link from 'next/link'
import useStyles from '../assets/styles/_NavLayout'
import { useRouter } from 'next/router'
import { Info, Palette, Edit, Bookmarks, Close } from '@mui/icons-material'
import { getLatestBanners } from '../utilsCS/_get'
import FixedBanner from "./FixedBanner"
import FullBanner from './FullBanner'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'

const UserNavigation = (props) => handleAsync(props, (props) =>
{
    const { setError, Mounted } = props

    const [open, setOpen] = useState([])
    const [banners, setBanners] = useState([])
    const [fullBanner, setFullBanner] = useState()

    const classes = useStyles();

    useEffect(async () =>
    {
        const banners = await getLatestBanners()

        Redirects_CS.handleRes(banners)
        if (Mounted) setBanners(banners.obj)

        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/notifications/banner/last`, {
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
                Redirects_CS.handleRes(res)
                if (Mounted) setFullBanner(res.obj)
            })
    }, [Mounted])

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
            {banners.length > 0
                && (<Box
                    sx={{ width: 300 }}
                >
                    {banners.map(b => <FixedBanner banner={b} />)}
                </Box>)}

            {fullBanner && open && (<FullBanner banner={fullBanner} setOpen={setOpen} />)}
        </Box>
    )
})

export default UserNavigation