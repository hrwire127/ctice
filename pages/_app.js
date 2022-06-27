import React, { useEffect, useState } from 'react'
import Layout from "../components/layouts/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import App from 'next/app';
import { determRendering, getGlobals } from '../utilsCS/_basic'

function MyApp({ Component, pageProps, globals })
{
    return (
        <>
            <Head>
                <title>Ctice</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout globals={globals}>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}
MyApp.getInitialProps = async (appContext) =>
{
    const appProps = await App.getInitialProps(appContext);
    return determRendering(appContext.ctx, () =>
    {
        return { ...appProps, globals: {} }
    }, () =>
    {
        let globals = getGlobals(appContext.ctx)
        return { globals, ...appProps }
    })
};

export default MyApp;
