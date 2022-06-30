import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import { Box } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import Router from "next/router"
import UserContext from '../context/contextUser'
import AdminContext from '../context/contextAdmin'
import StyleContext from '../context/contextStyle'
import SortContext from '../context/contextSort'
import DeviceContext from '../context/contextDevice'
import { themeLight, themeBlack } from '../context/theme'
import { styleCompact, styleFull } from '../context/styleEnum'
import Loading from "../Loading"
import Header from '../Header'
import ErrorPage from '../ErrorPage'
import BackToTop from '../BackToTop'

function Layout(props)
{
    const { globals } = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(props.children.props.error)

    const [light, setThemeLight] = useState(globals.lightTheme);
    const [style, setStyle] = useState(globals.style);
    const [sort, setSorting] = useState(globals.sort);

    const { isUser, isAdmin } = globals

    useEffect(() =>
    {
        const start = () =>
        {
            setLoading(true);
        };
        const end = () =>
        {
            const error = props.children.props.error
            if (error) setError(error)
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

    const [userCtx, setUser] = useState(isUser ? isUser : false)
    const [adminCtx, setAdmin] = useState(isAdmin ? isAdmin : false)

    useEffect(() =>
    {
        if (isUser) setUser(isUser)
        if (isAdmin) setAdmin(isAdmin)
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

    const DeviceCtxValue = {
        isBrowser,
        doclimit: isBrowser
            ? (process.env.NEXT_PUBLIC_DOC_LIMIT_BROWSER * (style === styleCompact ? process.env.NEXT_PUBLIC_COMPACT_COEFICIENT : 1))
            : (process.env.NEXT_PUBLIC_DOC_LIMIT_MOBILE * (style === styleCompact ? process.env.NEXT_PUBLIC_COMPACT_COEFICIENT : 1))
    }

    const mainStyle = {
        position: "relative",
        width: "100%",
        // minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden"
    }

    const Container = {
        flex: 1,
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    }

    // const cache = createCache({
    //     key: 'my-prefix-key',
    //     nonce: nonce,
    //     prepend: true,
    //   });

    return (
        <UserContext.Provider value={userCtx}>
            <AdminContext.Provider value={adminCtx}>
                <ThemeProvider theme={light ? themeLight : themeBlack}>
                    <StyleContext.Provider value={style}>
                        <SortContext.Provider value={sort}>
                            <DeviceContext.Provider value={DeviceCtxValue}>
                                {loading
                                    ? (<LoadingPage />)
                                    : (<main style={mainStyle}>
                                        {error
                                            ? (<Box sx={{ flex: 1, backgroundColor: "background.default" }}>
                                                {childrenwprops.props.noHeader && adminCtx ? (<></>) : (<Header title="Ctice" />)}
                                                <ErrorPage message={error.message} status={error.status} />
                                            </Box>)
                                            : (<>
                                                {childrenwprops.props.noHeader && adminCtx ? (<></>) : (<Header title="Ctice" />)}
                                                <Box sx={Container}
                                                >
                                                    <Box id="back-to-top-anchor" />
                                                    {childrenwprops}
                                                    <BackToTop />
                                                </Box>
                                                <div className="cover"></div>
                                            </>)
                                        }
                                    </main>)
                                }
                            </DeviceContext.Provider>
                        </SortContext.Provider>
                    </StyleContext.Provider>
                </ThemeProvider>
            </AdminContext.Provider>
        </UserContext.Provider>
    )
}

export default Layout;