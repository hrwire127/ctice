import React, { useEffect, useState } from 'react'
import Layout from "../components/layouts/Layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import App from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary'
import { determRendering, getGlobals } from '../utilsCS/_basic'

function MyApp({ Component, pageProps, globals })
{
    useEffect(() =>
    {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles && jssStyles.parentNode)
            jssStyles.parentNode.removeChild(jssStyles)
    }, [])

    return (
        <Layout globals={globals}>
            <ErrorBoundary>
                <Component {...pageProps} />
            </ErrorBoundary>
        </Layout>
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
