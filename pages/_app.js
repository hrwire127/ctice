import React, { useEffect, useState } from 'react'
import Layout from "../components/layouts/Layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import App from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary'
import { determRendering, getGlobals } from '../utilsCS/_basic'
import { CacheProvider } from '@emotion/react';

function createEmotionCache()
{
    return createCache({ key: 'css', prepend: true });
}

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps, globals })
{
    useEffect(() =>
    {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles && jssStyles.parentNode)
            jssStyles.parentNode.removeChild(jssStyles)
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <Layout globals={globals}>
                <ErrorBoundary>
                    <Component {...pageProps} />
                </ErrorBoundary>
            </Layout>
        </CacheProvider>
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
