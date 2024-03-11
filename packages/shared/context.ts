import { Context } from './params';
import { TextKey } from './types';

export type ContextLink = {
    url: string;
    lenkeTekstId: TextKey;
    context: Context;
};

export const arbeidsflateLenker = (XP_BASE_URL: string): ContextLink[] => [
    personContextLenke(XP_BASE_URL),
    arbeidsgiverContextLenke(XP_BASE_URL),
    samarbeidspartnerContextLenke(XP_BASE_URL),
];

export const personContextLenke = (XP_BASE_URL: string): ContextLink => {
    return {
        url: `${XP_BASE_URL}`,
        lenkeTekstId: 'rolle_privatperson',
        context: 'privatperson',
    };
};

export const arbeidsgiverContextLenke = (XP_BASE_URL: string): ContextLink => {
    return {
        url: `${XP_BASE_URL}/no/bedrift`,
        lenkeTekstId: 'rolle_arbeidsgiver',
        context: 'arbeidsgiver',
    };
};

export const samarbeidspartnerContextLenke = (XP_BASE_URL: string): ContextLink => {
    return {
        url: `${XP_BASE_URL}/no/samarbeidspartner`,
        lenkeTekstId: 'rolle_samarbeidspartner',
        context: 'samarbeidspartner',
    };
};

export const makeContextLinks = (XP_BASE_URL: string): ContextLink[] => [
    personContextLenke(XP_BASE_URL),
    arbeidsgiverContextLenke(XP_BASE_URL),
    samarbeidspartnerContextLenke(XP_BASE_URL),
];

// Viser ulike context lenker basert på nåværende context
export const getContextLink = ({ arbeidsflate, XP_BASE_URL }: { arbeidsflate: Context; XP_BASE_URL: string }) =>
    arbeidsflate === 'arbeidsgiver'
        ? arbeidsgiverContextLenke(XP_BASE_URL)
        : arbeidsflate === 'samarbeidspartner'
          ? samarbeidspartnerContextLenke(XP_BASE_URL)
          : personContextLenke(XP_BASE_URL);
