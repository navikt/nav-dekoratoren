import { Params } from "decorator-shared/params";
import { Features } from "decorator-shared/types";
import {
    getComplexFooterLinks,
    getSimpleFooterLinks,
} from "../../menu/main-menu";
import { env } from "../../env/server";
import html, { Template } from "decorator-shared/html";
import { getModal } from "../screensharing-modal";
import { LogoutWarning } from "../logout-warning";
import { Feedback } from "../feedback";
import { SimpleFooter } from "./simple-footer";
import { ConsentBanner } from "../consent-banner";
import { ComplexFooter } from "./complex-footer";

const CONTACT_URL = `${env.XP_BASE_URL}/kontaktoss`;

type FooterProps = {
    params: Params;
    features: Features;
    withContainers: boolean;
};

export const FooterTemplate = async ({
    params,
    features,
    withContainers,
}: FooterProps): Promise<Template> => {
    const { shareScreen, feedback, simple, simpleFooter, language, context } =
        params;

    const footerContent = html`
        ${getModal({
            enabled: shareScreen && features["dekoratoren.skjermdeling"],
        })}
        ${ConsentBanner({ foo: "bar" })}
        <d-chatbot></d-chatbot>
        ${LogoutWarning()}
        ${feedback ? Feedback({ contactUrl: CONTACT_URL }) : undefined}
        ${simple || simpleFooter
            ? SimpleFooter({
                  links: await getSimpleFooterLinks({
                      language,
                  }),
                  features,
              })
            : ComplexFooter({
                  links: await getComplexFooterLinks({
                      language,
                      context,
                  }),
                  features,
              })}
    `;

    return withContainers
        ? html`
              <div id="decorator-footer">
                  <decorator-footer>${footerContent}</decorator-footer>
              </div>
          `
        : footerContent;
};
