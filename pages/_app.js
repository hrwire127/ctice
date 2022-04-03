import Layout from "../components/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"
import Head from 'next/head'

export default function MyApp({ Component, pageProps })
{
    return (
        <Layout>
            <Head>
                <title>Ctice</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    )
}