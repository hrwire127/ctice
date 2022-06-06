import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Header from './Header'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import Loading from "../components/Loading"
import Router from "next/router";
import CS_Redirects from '../utilsCS/CS_Redirects';
import { ThemeProvider } from '@mui/material/styles';
import { themeLight, themeBlack } from './context/theme'
import HomeNavigation from './HomeNavigation'
import UserNavigation from './UserNavigation'
import { StyledEngineProvider } from '@mui/material/styles';

export default function Layout(props)
{
    const { globals } = props;
    const [loading, setLoading] = useState(false);
    const [light, setThemeLight] = useState(globals.lightTheme);


    useEffect(() =>
    {
        const start = () =>
        {
            setLoading(true);
        };
        const end = () =>
        {
            setLoading(false);
        };
        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);
        return () =>
        {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    const [userCtx, setUser] = useState(globals.isUser ? globals.isUser : false)
    const [adminCtx, setAdmin] = useState(globals.isAdmin ? globals.isAdmin : false)

    useEffect(() =>
    {
        if (globals.isUser)
        {
            setUser(globals.isUser)
        }
        if (globals.isAdmin)
        {
            setAdmin(globals.isAdmin)
        }
    }, [userCtx, adminCtx]);

    const toggleTheme = async () =>
    {
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/theme`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { light, secret: process.env.NEXT_PUBLIC_SECRET }
                )
            }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window)
                setThemeLight(res.obj)
            })
    }

    let childrenwprops = props.children;

    if (React.isValidElement(props.children))
    {
        childrenwprops = React.cloneElement(props.children, { ...props.children.props, light, setThemeLight });
    }

    return (
        <UserContext.Provider value={userCtx}>
            <AdminContext.Provider value={adminCtx}>
                <ThemeProvider theme={light ? themeLight : themeBlack}>
                    <StyledEngineProvider injectFirst>
                        {loading
                            ? (
                                <Box sx={{ width: "100vw", height: "100vh", backgroundColor: "background.default" }}>
                                    <Loading fullPage={true} />
                                </Box>
                            )
                            : (<main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                {childrenwprops.props.noHeader && adminCtx ? (<></>) : (<Header sections={[]} title="Ctice" />)}

                                {childrenwprops.props.noHeader && adminCtx
                                    ? (<Box sx={
                                        { margin: 0, flex: 1, backgroundColor: "background.default" }
                                    }
                                    >
                                        {childrenwprops}
                                    </Box>)
                                    : (<Box sx={{ flex: 1, backgroundColor: "background.default" }}
                                    >
                                        {childrenwprops.props.nav
                                            ? childrenwprops.props.nav === "Home"
                                                ? (<HomeNavigation>{childrenwprops}</HomeNavigation>)
                                                : (<UserNavigation>{childrenwprops}</UserNavigation>)
                                            : (<>{childrenwprops}</>)
                                        }
                                    </Box>)
                                }
                            </main>)
                        }
                    </StyledEngineProvider>
                </ThemeProvider>
            </AdminContext.Provider>
        </UserContext.Provider>
    )
} 