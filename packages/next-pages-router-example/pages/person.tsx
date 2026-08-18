import Head from "next/head";
import ParamBuilder from "@/components/ParamBuilder";

export default function Person() {
    return (
        <>
            <Head>
                <title>Person | Testside for Dekoratøren</title>
            </Head>
            <ParamBuilder initialPath="/person" title="Person" />
        </>
    );
}
