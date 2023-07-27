import Mustache from "mustache";
import { Header } from "./views/header";
import { HeaderMenuLinks } from "./views/header-menu-links";
import { SimpleFooter } from "./views/simple-footer";
import { ComplexFooter } from "./views/complex-footer";
import { Footer } from "./views/footer";
import { Breadcrumbs } from "./views/breadcrumbs";
import { Index } from "./views";
import { Response } from "express";


// Maybe move GetComponents here, i don't really like the abstraction right now
const views = {
      header: Header,
      'index': Index,
      'header-menu-links': HeaderMenuLinks,
      'simple-footer': SimpleFooter,
      'complex-footer': ComplexFooter,
      'footer': Footer,
      'breadcrumbs': Breadcrumbs
}

export type ViewKey = keyof typeof views

export function RenderView(view: ViewKey, model: any) {
  const viewContent = views[view];
  const rendered = Mustache.render(viewContent, model, views);
  return rendered;
}

export function SendView(view: ViewKey, model: any, res: Response) {
    res.status(200).send(RenderView(view, model))
}
