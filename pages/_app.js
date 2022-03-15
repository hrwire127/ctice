import Layout from "../components/layout"
import "../assets/styles/body.css"
import "../assets/styles/TextArea.css"

export default function MyApp({ Component, pageProps })
{
    return (
        <Layout>
            <Component {...pageProps} />   
        </Layout>
    )
}