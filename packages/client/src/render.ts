import {  ErrorView } from "decorator-shared/html";
import { FetchError } from 'decorator-shared/errors'
// Just the type
import { type TemplateName, type TemplateParams } from 'decorator-server/src/rendering-service'
import { Language } from "decorator-shared/params";

type RenderOptions = {
    fallback: ErrorView
}

type QuerySelector = `.${string}` | `#${string}`

export class ClientRenderer {
    constructor(private language: Language) { }

    async render(name: TemplateName, params: TemplateParams<TemplateName>, options: RenderOptions) {
        try {
            const response = await fetch('/api/render', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type to JSON
                },
                body: JSON.stringify({
                    name,
                    params,
                    language: this.language
                })
            })
            if (!response.ok) {
                    throw new Error(await response.text());
            }

            const rendered = await response.text()

            return rendered
        } catch (error) {
            console.log('this is the error', error)
            // How should types be handled here?
            const errorView = options.fallback(error as FetchError).render()
            return errorView
        }
    }

    // element can be made better by exporting the types from css modules
    // @todo: what would be the best interface here?

    async swap({ target, template}: { target: QuerySelector, template: TemplateName}, params: TemplateParams<TemplateName>, options: RenderOptions) {
        const rendered = await this.render(template, params, options)
        const oldElement = document.querySelector(target)
        if (oldElement) {
            oldElement.innerHTML = rendered
        }
    }
}

