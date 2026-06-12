import "@navikt/ds-css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setParams } from "@navikt/nav-dekoratoren-moduler/csr";
import { buildDecoratorParams } from "@/lib/decorator-params";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        void setParams(buildDecoratorParams(router.asPath));
    }, [router.asPath, router.isReady]);

    return <Component {...pageProps} />;
}
