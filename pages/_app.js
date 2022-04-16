import Layout from "../components/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'
import React, { useEffect, useState } from 'react'


export default function MyApp({ Component, pageProps })
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