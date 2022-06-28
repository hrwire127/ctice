import Document, {
    Head,
    Html,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document'

import { ServerResponse } from 'http'

type ResponseWithNonce = ServerResponse & { locals: { nonce?: string } }

type CustomDocumentProps = {
    nonce?: string
}

class CustomDocument extends Document<CustomDocumentProps> {
    static async getInitialProps(ctx: DocumentContext)
    {
        // get the nonce from res.locals.nonce
        const nonce = (ctx.res as ResponseWithNonce).locals.nonce
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