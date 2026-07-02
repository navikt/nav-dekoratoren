import Head from "next/head";
import ParamBuilder from "@/components/ParamBuilder";

export default function Home() {
    return (
        <>
            <Head>
                <title>Testside for Dekoratøren</title>
                <meta
                    name="description"
                    content="Eksempelapp for testing av Dekoratøren"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <ParamBuilder initialPath="/" title="Forside" />
        </>
    );
}
