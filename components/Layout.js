import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import StyleContext from './context/contextStyle'
import SortContext from './context/contextSort'
import Router from "next/router";
import { ThemeProvider } from '@mui/material/styles';
import { themeLight, themeBlack } from './context/theme'
import Loading from "./Loading"
import Header from './Header'
import ErrorPage from './ErrorPage'
import { StyledEngineProvider } from '@mui/material/styles';
import Redirects_CS from '../utilsCS/CS_Redirects'

export default function Layout(props)
{
    const { globals } = props;
    const [loading, setLoading] = useState(false);
    const [light, setThemeLight] = useState(globals.lightTheme);
    const [style, setStyle] = useState(globals.style);
    const [sort, setSorting] = useState(globals.sort);

    const [error, setError] = useState(props.children.props.error)

    useEffect(() =>
    {
        const start = () =>
        {
            setLoading(true);
        };
        const end = () =>
        {
            setError(props.children.props.error)
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

    let childrenwprops = props.children;

    if (React.isValidElement(props.children))
    {
        childrenwprops = React.cloneElement(props.children, {
            ...props.children.props,
            light,
            setThemeLight,
            setStyle,
            setSorting,
            setError
        });
    }

    const LoadingPage = () =>
    {
        return (<Box sx={{ width: "100vw", height: "100vh", backgroundColor: "background.default" }}>
            <Loading fullPage={true} />
        </Box>)
    }

    return (
        <UserContext.Provider value={userCtx}>
            <AdminContext.Provider value={adminCtx}>
                <ThemeProvider theme={light ? themeLight : themeBlack}>
                    <StyleContext.Provider value={style}>
                        <SortContext.Provider value={sort}>
                            <StyledEngineProvider injectFirst>
                                {loading
                                    ? (<LoadingPage />)
                                    : (<main style={{
                                        position: "relative",
                                        width: "100vw",
                                        height: "100vh",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between"
                                    }}>
                                        {error
                                            ? (<Box sx={{ flex: 1, backgroundColor: "background.default" }}>
                                                {childrenwprops.props.noHeader && adminCtx ? (<></>) : (<Header title="Ctice" />)}
                                                <ErrorPage message={error.message} status={error.status} />
                                            </Box>)
                                            : (<>
                                                {childrenwprops.props.noHeader && adminCtx ? (<></>) : (<Header title="Ctice" />)}
                                                <Box sx={{ flex: 1, backgroundColor: "background.default" }}
                                                >
                                                    {childrenwprops}
                                                </Box>
                                                <div className="cover"></div>
                                            </>)
                                        }
                                    </main>)
                                }
                            </StyledEngineProvider>
                        </SortContext.Provider>
                    </StyleContext.Provider>
                </ThemeProvider>
            </AdminContext.Provider>
        </UserContext.Provider >
    )
} 