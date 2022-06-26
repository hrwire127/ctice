import React, { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import
{
    CssBaseline, Drawer, Box,
    AppBar, Toolbar, List,
    Typography, Divider, IconButton,
    SwipeableDrawer, Badge
} from '@mui/material';
import { Menu, ChevronLeft, Close } from '@mui/icons-material';
import { mainDrawerItems } from '../DrawerItems';
import Link from 'next/link'
import useLocalStorage from "../hooks/useLocalStorage"
import useWindowSize from '../hooks/useWindowSize';
import useStyles from "../../assets/styles/_Layout"

const drawerWidth = 240;

const AppBar_ = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer_ = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);


function AdminLayout(props)
{
    const [windowMinSize] = useWindowSize(960, 0);
    const [windowMaxSize] = useWindowSize(960, 2);
    const [open, setOpen] = useLocalStorage("admin_drawer", windowMaxSize ? true : false, true);

    const classes = useStyles()

    const toggleDrawer = () =>
    {
        if (windowMaxSize)
        {
            setOpen(!open);
        }
    };

    useEffect(() =>
    {
        if (windowMinSize)
        {
            setOpen(false)
        }
    }, [windowMinSize])


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar_ position="absolute" open={open}>
                <Toolbar>
                    {windowMaxize && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                mr: 36,
                                color: "primary",
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        Admin
                    </Typography>
                    <Link href="/">
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <Close />
                            </Badge>
                        </IconButton>
                    </Link>
                </Toolbar>
            </AppBar_>
            <Drawer_ variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeft />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    {mainDrawerItems}
                </List>
            </Drawer_>

            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.background.default,
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    paddingRight: 0 
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
}

export default AdminLayout;