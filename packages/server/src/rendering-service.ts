import {
    FeedbackSuccess, feedbackSchema
} from './views/feedback/feedback-success'

// Proof of concept
const templates = {
    'feedback-success': {
        view: FeedbackSuccess,
        schema: feedbackSchema
    }
} as const


export type Templates = typeof templates
export type TemplateName = keyof typeof templates
export type TemplateParams<T extends TemplateName> = Parameters<Templates[T]['view']>[0]
// export type TemplateParams<T extends TemplateName> = Parameters<typeof templates[T]>


export default class RenderingService {
  constructor() {}

  render(name: TemplateName, params: TemplateParams<TemplateName>) {
      const template = templates[name]
      const schema = template.schema

      const result = schema.safeParse(params)

      if (!result.success) {
          return {
              error: result.error
          }
      }

      return {
        view: template.view(params).render()
      }
  }
}
