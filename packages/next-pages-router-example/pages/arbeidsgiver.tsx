import Head from "next/head";
import ParamBuilder from "@/components/ParamBuilder";

export default function Arbeidsgiver() {
    return (
        <>
            <Head>
                <title>Arbeidsgiver | Testside for Dekoratøren</title>
            </Head>
            <ParamBuilder initialPath="/arbeidsgiver" title="Arbeidsgiver" />
        </>
    );
}
