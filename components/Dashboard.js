import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Drawer, Box, AppBar, Toolbar, List, Typography, Divider, IconButton, Badge, Container, Grid, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import Declrs from './Declrs';
import Link from 'next/link'

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

const mdTheme = createTheme();

function Dashboard()
{
    const LogOut = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/logout`,
            { method: 'POST' }
        )
            .then(response => response.json())
            .then(async res =>
            {
                console.log(res)
                if (res.type === "Home" || res.type === "Error")
                {
                    window.location = res.redirect;
                    // changeUser(false)
                }
            })
    }

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () =>
    {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar_ position="absolute" open={open}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography>
                        <Link href="/">
                            <IconButton color="inherit">
                                <Badge color="secondary">
                                    <CloseIcon />
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
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        {mainListItems}
                        <Divider sx={{ my: 1 }} />
                        {secondaryListItems}
                    </List>
                </Drawer_>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12} md={8} lg={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <Chart />
                                </Paper>
                            </Grid>
                            {/* Recent Deposits */}
                            <Grid item xs={10} md={4} lg={3}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={10} md={4} lg={6}>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: "center",
                                                    height: 90,
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Link href="/create"><IconButton><AddIcon /></IconButton></Link>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={10} md={4} lg={6}>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: "center",
                                                    height: 90,
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <IconButton onClick={LogOut}><ExitToAppIcon /></IconButton>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={10} md={4} lg={6}>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: "center",
                                                    height: 90,
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Link href="/user/login"><IconButton><LoginIcon /></IconButton></Link>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={10} md={4} lg={6}>
                                            <Paper
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: "center",
                                                    height: 90,
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Link href="/user/register"><IconButton><AppRegistrationIcon /></IconButton></Link>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                </Paper>
                            </Grid>
                            {/* Recent Orders */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Declrs />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Dashboard;