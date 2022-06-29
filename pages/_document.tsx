import * as React from "react"
import Document, {
    Head,
    Html,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@mui/styles';
import { ServerResponse } from 'http'

type ResponseWithNonce = ServerResponse & { locals: { nonce?: string } }

type CustomDocumentProps = {
    nonce?: string
}

class CustomDocument extends Document<CustomDocumentProps> {
    static async getInitialProps(ctx: DocumentContext)
    {
        const nonce = (ctx.res as ResponseWithNonce).locals.nonce

        const sheet = new ServerStyleSheet();
        const sheets = new ServerStyleSheets();

        const originalRenderPage = ctx.renderPage;
        try
        {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props =>
                        sheet.collectStyles(
                            sheets.collect(<App {...props} />),
                        ),
                })

            const initialProps = await Document.getInitialProps(ctx)

            return {
                ...initialProps,
                nonce,
                styles: [
                    <React.Fragment key="styles">
                        {initialProps.styles}
                        {sheets.getStyleElement()}
                        {sheet.getStyleElement()}
                    </React.Fragment>,
                ],
            }
        } finally
        {
            sheet.seal()
        }
    }

    render()
    {
        return (
            <Html>
                {/* pass it to Next Head */}
                <Head nonce={this.props.nonce} />
                {/* <Head>
                    <title>Ctice</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head> */}
                <body>
                    <Main />
                    {/* pass it to Next scripts */}
                    <NextScript nonce={this.props.nonce} />
                </body>
            </Html>
        )
    }
}

export default CustomDocument