import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import Loading from "../components/Loading"
import Router from "next/router";
import { ThemeProvider } from '@mui/material/styles';
import { themeLight, themeBlack } from './context/theme'

export default function Layout(props)
{
    const { globals } = props;
    const [loading, setLoading] = useState(false);
    const [light, setThemeLight] = useState(true);


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

    const toggleTheme = () =>
    {
        setThemeLight(!light)
    }

    return (
        <UserContext.Provider value={userCtx}>
            <AdminContext.Provider value={adminCtx}>
                <ThemeProvider theme={light ? themeLight : themeBlack}>
                    {loading
                        ? (<Loading fullPage={true} />)
                        :
                        (<main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {props.children.props.noHeader && adminCtx ? (<></>) : (<Header sections={[]} title="Ctice" toggleTheme={toggleTheme}/>)}
                            <Box sx={props.children.props.noHeader && adminCtx ? { margin: 0, flex: 1 } : { mt: 3, mb: 3, flex: 1 }} >{props.children}</Box>

                        </main>)
                    }
                </ThemeProvider>
            </AdminContext.Provider>
        </UserContext.Provider>
    )
} 