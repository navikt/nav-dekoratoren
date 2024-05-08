import html from "decorator-shared/html";
import { Params } from "decorator-shared/params";
import { Features, Link, LinkGroup, Texts } from "decorator-shared/types";
import { getModal } from "decorator-shared/views/screensharing-modal";
import { Feedback } from "../feedback";
import { LogoutWarning } from "../logout-warning";
import { ComplexFooter } from "./complex-footer";
import { SimpleFooter } from "./simple-footer";
import { ChatbotWrapper } from "./chatbot-wrapper";

type FooterProps = {
    data: Params;
    features: Features;
    texts: Texts;
} & (
    | {
          simple: true;
          links: Link[];
      }
    | {
          simple: false;
          links: LinkGroup[];
      }
);

export const Footer = ({ simple, links, data, features, texts }: FooterProps) =>
    html` <div id="decorator-footer">
        ${getModal({
            enabled: data.shareScreen && features["dekoratoren.skjermdeling"],
            texts,
        })}
        ${data.chatbot && ChatbotWrapper(data.chatbotVisible)}
        ${data.logoutWarning ? LogoutWarning() : undefined}
        ${data.feedback ? Feedback({ texts }) : undefined}
        ${simple
            ? SimpleFooter({
                  links,
                  texts,
                  features,
              })
            : ComplexFooter({
                  texts,
                  links,
                  features,
              })}
    </div>`;
