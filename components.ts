
import z from 'zod'

import { Params, breadcrumbSchema } from './params'
import { Response } from 'express'
import { getTexts } from './server'
import { Index } from './views'
import Mustache from 'mustache'

const breadcrumbsSchema = z.object({
    breadcrumbs: z.array(breadcrumbSchema).default([]),
})

type Breadcrumbs = z.infer<typeof breadcrumbsSchema>

type Footer = {
    simple: boolean;
    innlogget: boolean;
}

type Texts = Awaited<ReturnType<typeof getTexts>>
type RenderParams = Params & Texts


export function GetComponents (res: Response, params: Params) {
    return {
        Index: async (scriptsAndLinks: string) => {

            const rendered = Mustache.render(Index(), {
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

            res.status(200).send(rendered)
            // return res.render('index', {
            //     scriptsAndLinks,
            //     simple: params.simple,
            //     lang: { [params.language]: true },
            //     way: "asdf",
            //     breadcrumbs: params.breadcrumbs.map((b, i, a) => ({
            //         ...b,
            //         last: a.length - 1 === i,
            //     })),
            //     language: params.language,
            //     ...(await getTexts(params))
            // })
        },
        Breadcrumbs: (breadcrumbs: Breadcrumbs) => {
            return res.render('breadcrumbs', breadcrumbs)
        },
        Header: (header: Footer) => {
            return res.render('header', header)
        },
        HeaderMenuLinks: async () => {
            return res.render('header-menu-links', {
                simple: params.simple,
                innlogget: false,
                ...(await getTexts(params)),
            })
        },
        Footer: (footer: Footer) => {
            return res.render('footer', footer)
        }
    }

}
