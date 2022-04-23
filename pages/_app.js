import Layout from "../components/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import App from 'next/app';

function MyApp({ Component, pageProps })
{
    return (
        <>
            <Head>
                <title>Ctice</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}
MyApp.getInitialProps = async (appContext) =>
{
    const appProps = await App.getInitialProps(appContext);

    return { ...appProps };
};

export default MyApp;
