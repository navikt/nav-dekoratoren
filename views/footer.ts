import { FooterLinks, Personvern } from "../server";
import { Texts } from "../texts";
import { html } from "../utils";
import { ComplexFooter } from "./complex-footer";
import { SimpleFooter } from "./simple-footer";


export type FooterProps = Parameters<typeof Footer>[0];

export function Footer({
    simple,
    texts,
    personvern,
    footerLinks
}: {
    simple: boolean
    texts: Texts
    personvern: Personvern
    footerLinks: FooterLinks
}) {
    if (simple) {
        return SimpleFooter({
            texts,
            personvern
        })
    }
    return ComplexFooter({
        texts,
        personvern,
        footerLinks
    })
}

