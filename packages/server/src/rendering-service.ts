import {
    FeedbackSuccess
} from './views/feedback/feedback-success'

// Proof of concept
const templates = {
    'feedback-success': FeedbackSuccess
} as const


export type Templates = typeof templates
export type TemplateName = keyof typeof templates
export type TemplateParams<T extends TemplateName> = Parameters<Templates[T]>[0]
// export type TemplateParams<T extends TemplateName> = Parameters<typeof templates[T]>


export default class RenderingService {
  constructor() {}

  templates = templates

  render(name: TemplateName, params: TemplateParams<TemplateName>) {
      const template = templates[name]
      return template(params).render()
  }
}
