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

    const [user, setUser] = useState(false)
    const [admin, setAdmin] = useState(false)

    useEffect(() =>
    {
        if (props.children.props.isUser)
        {
            setUser(props.children.props.isUser)
        }
        if (props.children.props.admin)
        {
            setAdmin(props.children.props.admin)
        }
    }, [user, admin]);


    return (
        <UserContext.Provider value={user}>
            <AdminContext.Provider value={admin}>
                {loading
                    ?
                    (<div style={{ position: "absolute", top: "50%", left: "50%" }}>
                        <Loading />
                    </div>)
                    :
                    (<main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        {props.children.props.noHeader ? (<></>) : (<Header sections={[]} title="Ctice" />)}

                        {props.children.props.noHeader
                            ? (<AdminLayout>{props.children}</AdminLayout>)
                            : (
                                <Box sx={props.children.props.noHeader ? { margin: 0, flex: 1 } : { mt: 3, mb: 3, flex: 1 }} >{props.children}</Box>
                            )
                        }

                    </main>)
                }
            </AdminContext.Provider>
        </UserContext.Provider>
    )
} 