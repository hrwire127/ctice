import React from "react"
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
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

function createEmotionCache()
{
    return createCache({ key: 'css', prepend: true });
}

type ResponseWithNonce = ServerResponse & { locals: { nonce?: string } }

type CustomDocumentProps = {
    nonce?: string,
    emotionStyleTags?: any
}

class CustomDocument extends Document<CustomDocumentProps> {
    static async getInitialProps(ctx: DocumentContext)
    {
        const nonce = (ctx.res as ResponseWithNonce).locals.nonce

        const sheet = new ServerStyleSheet();
        const sheets = new ServerStyleSheets();

        const originalRenderPage = ctx.renderPage;


        const cache = createEmotionCache();
        const { extractCriticalToChunks } = createEmotionServer(cache);

        try
        {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) =>
                    {
                        return function EnhanceApp(props)
                        {
                            return sheet.collectStyles(
                                sheets.collect(<App {...(Object.assign({ emotionCache: cache }, props))} />),
                            )
                        }
                    }
                })


            // (props) =>
            //                 sheet.collectStyles(
            //                     sheets.collect(<App {...(Object.assign({ emotionCache: cache }, props))} />),
            //                 ),
            //<App emotionCache={cache} {...props} />;


            const initialProps = await Document.getInitialProps(ctx)

            const emotionStyles = extractCriticalToChunks(initialProps.html);
            const emotionStyleTags = emotionStyles.styles.map((style) => (
                <style
                    data-emotion={`${style.key} ${style.ids.join(' ')}`}
                    key={style.key}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: style.css }}
                />
            ));

            return {
                ...initialProps,
                emotionStyleTags,
                nonce,
                styles: [ //fix admin + the scroll up btn
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
                {/* <Head nonce={this.props.nonce} /> */}
                <Head nonce={this.props.nonce} >
                    {(this.props as any).emotionStyleTags}
                </Head>
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