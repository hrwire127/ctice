import Document, {
    Head,
    Html,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document'
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

        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx)


        return { ...initialProps, nonce }
    }

    render()
    {
        return (
            <Html>
                {/* pass it to Next Head */}
                <Head nonce={this.props.nonce} />
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