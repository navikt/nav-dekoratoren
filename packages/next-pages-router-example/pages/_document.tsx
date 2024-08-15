import Document, {
    Html,
    Main,
    NextScript,
    DocumentContext,
    Head,
} from "next/document";
import {
    DecoratorComponents,
    fetchDecoratorReact,
    DecoratorEnvProps,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import React from "react";

const decoratorParams: DecoratorEnvProps = {
    env: "localhost",
    localUrl: "http://localhost:8089",
};

class _Document extends Document<{ decorator: DecoratorComponents }> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const decorator = await fetchDecoratorReact(decoratorParams);
        return { ...initialProps, decorator };
    }

    render() {
        const { Styles, Scripts, Header, Footer } = this.props.decorator;
        return (
            <Html lang="no">
                <Head />
                <Styles />
                <Scripts />

                <body>
                    <Header />
                    <Main />
                    <Footer />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default _Document;
