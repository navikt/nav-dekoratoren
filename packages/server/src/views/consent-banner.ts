import clsx from "clsx";
import cls from "decorator-client/src/styles/consent-banner.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { ChevronDownIcon, GlobeIcon } from "decorator-icons";
import html from "decorator-shared/html";
import { AvailableLanguage } from "decorator-shared/params";
import i18n from "../i18n";

export type ConsentBannerProps = {
  foo: string;
};
export const ConsentBanner = ({ foo }: ConsentBannerProps) => html`
  <consent-banner>
    <dialog class="${cls.consentBanner}">
      <h1>Denne siden bruker informasjonskapsler (cookies)</h1>
      <p>
        Når du besøker nav.no lagres anonymiserte data i nettleseren din, enten
        via informasjonskapsler (cookies) eller andre teknologier.
      </p>
      <p>
        Noen av disse er nødvendige for at løsningene på nav.no skal fungere
        teknisk. Annen anonymisert informasjon bruker vi for å lære mer om
        hvordan nav.no brukes gjennom brukerstatistikk, klikk, navigasjon og
        besøksmønster. Dette kalles ofte webanalyse.
      </p>
      <p>
        Det gjør vi for å kunne fortsette å lage gode brukeropplevelser og
        tydelig innhold for innbyggerne. Du kan når som helst trekke samtykket
        ditt ved å klikke lenken "Samtykke til informasjonskapsler" nederst på
        nav.no.
      </p>
      <button class="${clsx(cls.button, cls.buttonMain)}">
        Samtykke til informasjonskapsler
      </button>
    </dialog>
  </consent-banner>
`;
