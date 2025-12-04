export type RedactConfig = {
    redactPath: boolean;
    redactTitle: boolean;
};

export const knownRedactPaths = new Map<string, RedactConfig>([
    [
        "/testsider/minoversikt/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/testsider/minoversikt/navnitittel/:redact:",
        { redactPath: true, redactTitle: true },
    ],
    [
        "/syk/sykefravaer/sykmeldinger/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepenger/vedtak/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepenger/vedtak/arkivering/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykefravaer/inntektsmeldinger/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepengesoknad/avbrutt/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepengesoknad/kvittering/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepengesoknad/sendt/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/syk/sykepengesoknad/soknader/:redact:",
        { redactPath: true, redactTitle: false },
    ],
    [
        "/arbeid/dagpenger/meldekort/periode/:redact:",
        { redactPath: true, redactTitle: false },
    ],
]);
