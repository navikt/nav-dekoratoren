import type { GetServerSideProps } from "next";
import Head from "next/head";
import ParamBuilder from "@/components/ParamBuilder";

type Props = {
    initialPath: string;
    title: string;
};

export default function Sak({ initialPath, title }: Props) {
    return (
        <>
            <Head>
                <title>{`${title} | Testside for Dekoratøren`}</title>
            </Head>
            <ParamBuilder initialPath={initialPath} title={title} />
        </>
    );
}

export const getServerSideProps = (async ({ params, resolvedUrl }) => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    return {
        props: {
            initialPath: resolvedUrl,
            title: `Sak ${id ?? ""}`.trim(),
        },
    };
}) satisfies GetServerSideProps<Props>;
