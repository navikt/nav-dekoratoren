import { Params } from "decorator-shared/params";
import html, { Template } from "decorator-shared/html";
import { DecoratorUtils } from "../decorator-utils";
import { SimpleHeader } from "./simple-header";
import { clientEnv, env } from "../../env/server";
import { ComplexHeader } from "./complex-header";
import { makeContextLinks } from "../../context";

const frontPageUrl = clientEnv.XP_BASE_URL;

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
        frontPageUrl,
    });

    const headerContent =
        simple || simpleHeader
            ? SimpleHeader({
                  frontPageUrl,
                  decoratorUtils,
                  loginUrl: env.LOGIN_URL,
              })
            : ComplexHeader({
                  frontPageUrl,
                  decoratorUtils,
                  loginUrl: env.LOGIN_URL,
                  contextLinks: makeContextLinks(language),
                  context,
                  language,
              });

    return withContainers
        ? html`
              <header id="decorator-header">
                  <decorator-header>${headerContent}</decorator-header>
              </header>
          `
        : headerContent;
};
