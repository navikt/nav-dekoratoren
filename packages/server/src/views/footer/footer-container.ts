import { Params } from "decorator-shared/params";
import { Features } from "decorator-shared/types";
import { Footer } from "./footer";
import {
    getComplexFooterLinks,
    getSimpleFooterLinks,
} from "../../menu/main-menu";
import { env } from "../../env/server";
import html, { Template } from "decorator-shared/html";

export const FooterContainer = async ({
    params,
    features,
    withOuterElements,
}: {
    params: Params;
    features: Features;
    withOuterElements?: boolean;
}): Promise<Template> => {
    const footerContent = Footer({
        ...(params.simple || params.simpleFooter
            ? {
                  simple: true,
                  links: await getSimpleFooterLinks({
                      language: params.language,
                  }),
              }
            : {
                  simple: false,
                  links: await getComplexFooterLinks({
                      language: params.language,
                      context: params.context,
                  }),
              }),
        params,
        features,
        contactUrl: `${env.XP_BASE_URL}/kontaktoss`,
    });

    return withOuterElements
        ? html`
              <div id="decorator-footer">
                  <decorator-footer>${footerContent}</decorator-footer>
              </div>
          `
        : footerContent;
};
