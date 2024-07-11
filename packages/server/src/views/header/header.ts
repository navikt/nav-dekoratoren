import { Params } from "decorator-shared/params";
import html, { Template } from "decorator-shared/html";
import { DecoratorUtils } from "../decorator-utils";
import { SimpleHeader } from "./simple-header";
import { clientEnv, env } from "../../env/server";
import { ComplexHeader } from "./complex-header";
import { makeContextLinks } from "../../context";

type HeaderProps = {
    params: Params;
    withContainers: boolean;
};

export const HeaderTemplate = ({
    params,
    withContainers,
}: HeaderProps): Template => {
    const {
        breadcrumbs,
        availableLanguages,
        utilsBackground,
        simple,
        simpleHeader,
        context,
        language,
    } = params;

    const decoratorUtils = DecoratorUtils({
        breadcrumbs,
        availableLanguages,
        utilsBackground,
    });

    const headerContent =
        simple || simpleHeader
            ? SimpleHeader({
                  frontPageUrl: clientEnv.XP_BASE_URL,
                  decoratorUtils,
                  loginUrl: env.LOGIN_URL,
              })
            : ComplexHeader({
                  frontPageUrl: clientEnv.XP_BASE_URL,
                  contextLinks: makeContextLinks(language),
                  context,
                  language,
                  decoratorUtils,
                  loginUrl: env.LOGIN_URL,
              });

    return withContainers
        ? html`
              <header id="decorator-header">
                  <decorator-header>${headerContent}</decorator-header>
              </header>
          `
        : headerContent;
};
