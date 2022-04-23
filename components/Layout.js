import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import Loading from "../components/Loading"
import Router from "next/router";
import AdminLayout from "./AdminLayout"

export default function Layout(props)
{
    const { globals } = props;
    const [loading, setLoading] = useState(false);
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

    const [userCtx, setUser] = useState(false)
    const [adminCtx, setAdmin] = useState(false)

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


    return (
        <UserContext.Provider value={userCtx}>
            <AdminContext.Provider value={adminCtx}>
                {loading
                    ?
                    (<div style={{ position: "absolute", top: "50%", left: "50%" }}>
                        <Loading />
                    </div>)
                    :
                    (<main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        {props.children.props.noHeader && adminCtx ? (<></>) : (<Header sections={[]} title="Ctice" />)}
                        <Box sx={props.children.props.noHeader && adminCtx ? { margin: 0, flex: 1 } : { mt: 3, mb: 3, flex: 1 }} >{props.children}</Box>

                    </main>)
                }
            </AdminContext.Provider>
        </UserContext.Provider>
    )
} 