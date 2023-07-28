
import z from 'zod'

import { Params, breadcrumbSchema } from './params'
import { Response } from 'express'
import { getTexts } from './server'
import { Index } from './views'
import Mustache from 'mustache'
import { RenderView } from './views-utils'

const breadcrumbsSchema = z.object({
    breadcrumbs: z.array(breadcrumbSchema).default([]),
})

type Breadcrumbs = z.infer<typeof breadcrumbsSchema>

type Footer = {
    simple: boolean;
    innlogget: boolean;
}

type Texts = Awaited<ReturnType<typeof getTexts>>


export function GetComponents (res: Response, params: Params) {
    return {
        Index: async (scriptsAndLinks: string) => {
            res.sendView('index', {
                scriptsAndLinks,
                simple: params.simple,
                lang: { [params.language]: true },
                way: "asdf",
                breadcrumbs: params.breadcrumbs.map((b, i, a) => ({
                    ...b,
                    last: a.length - 1 === i,
                })),
                language: params.language,
                ...(await getTexts(params))
            })
        },
        Breadcrumbs: (breadcrumbs: Breadcrumbs) => {
            return res.sendView('breadcrumbs', breadcrumbs)
        },
        Header: (header: Footer) => {
            return res.sendView('header', header)
        },
        HeaderMenuLinks: async () => {
            return res.sendView('header-menu-links', {
                simple: params.simple,
                innlogget: false,
                ...(await getTexts(params)),
            })
        },
        Footer: (footer: Footer) => {
            return res.sendView('footer', footer)
        }
    }

}
