import Document, {
    Html,
    Main,
    NextScript,
    DocumentContext,
    Head,
} from "next/document";
import {
    fetchDecoratorReact,
    DecoratorEnvProps,
    DecoratorComponentsReact,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import React from "react";

const decoratorParams: DecoratorEnvProps = {
    env: "localhost",
    localUrl: "http://localhost:8089",
};

class _Document extends Document<{ Decorator: DecoratorComponentsReact }> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        const Decorator = await fetchDecoratorReact(decoratorParams);
        return { ...initialProps, Decorator };
    }

    render() {
        const { Decorator } = this.props;
        return (
            <Html lang="no">
                <Head>
                    <Decorator.HeadAssets />
                </Head>
                <body>
                    <Decorator.Header />
                    <Main />
                    <Decorator.Footer />
                    <Decorator.Scripts />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default _Document;
