import Mustache from "mustache";
import { Header } from "./views/header";
import { HeaderMenuLinks } from "./views/header-menu-links";
import { SimpleFooter } from "./views/simple-footer";
import { ComplexFooter } from "./views/complex-footer";
import { Footer } from "./views/footer";
import { Breadcrumbs } from "./views/breadcrumbs";


export function RenderView(view: string, model: any) {
  const rendered = Mustache.render(view, model, {
      header: Header,
      'header-menu-links': HeaderMenuLinks,
      'simple-footer': SimpleFooter,
      'complex-footer': ComplexFooter,
      'footer': Footer,
      'breadcrumbs': Breadcrumbs
  });
  return rendered;
}
