import Layout from "../components/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Router from "next/router";
import Loading from "../components/Loading"


export default function MyApp({ Component, pageProps })
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

    return (
        <>
            <Head>
                <title>Ctice</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout>
                {loading
                    ? (<div style={{ position: "absolute", top: "50%", left: "50%" }}>
                        <Loading />
                    </div>)
                    : (<Component {...pageProps} />)
                }
            </Layout>
        </>
    )
}