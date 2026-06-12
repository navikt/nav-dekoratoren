import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useSyncExternalStore } from "react";
import {
    BodyShort,
    Box,
    Button,
    Checkbox,
    Heading,
    HStack,
    Select,
    TextField,
    ToggleGroup,
    VStack,
} from "@navikt/ds-react";
import {
    setParams,
    type DecoratorParams,
} from "@navikt/nav-dekoratoren-moduler/csr";
import styles from "@/styles/Home.module.css";
import { buildDecoratorParams } from "@/lib/decorator-params";

type Props = {
    initialPath: string;
    title: string;
};

const formatParams = (params: ReturnType<typeof buildDecoratorParams>) =>
    JSON.stringify(params, null, 2);

const emptySubscribe = () => () => {};

type DirectParamsUpdate = {
    path: string;
    params: DecoratorParams;
};

type BuilderParamKey =
    | "language"
    | "context"
    | "availableLanguages"
    | "breadcrumbs"
    | "utilsBackground"
    | "chatbotVisible"
    | "simple"
    | "simpleHeader"
    | "redirectOnUserChange"
    | "pageType";

type RouteTargetKey =
    | "frontpage"
    | "arbeidsgiver"
    | "person"
    | "sak123"
    | "sak456";

type WorkflowMode = "payload" | "navigation";

type ParamConfig = {
    key: BuilderParamKey;
    label: string;
    defaultValue: DecoratorParams[BuilderParamKey];
};

const paramConfigs: ParamConfig[] = [
    { key: "language", label: "Språk", defaultValue: "en" },
    { key: "context", label: "Context", defaultValue: "samarbeidspartner" },
    {
        key: "availableLanguages",
        label: "Tilgjengelige språk",
        defaultValue: [
            { locale: "nb", handleInApp: true },
            { locale: "en", handleInApp: true },
        ],
    },
    {
        key: "breadcrumbs",
        label: "Brødsmuler",
        defaultValue: [
            {
                title: "Forside",
                url: "https://www.nav.no",
            },
            {
                title: "Sykepenger",
                url: "/person/sykepenger",
                handleInApp: true,
            },
        ],
    },
    {
        key: "utilsBackground",
        label: "Bakgrunn for brødsmuler/språk",
        defaultValue: "transparent",
    },
    { key: "chatbotVisible", label: "Vis chatbot", defaultValue: true },
    { key: "simple", label: "Enkel dekoratør", defaultValue: false },
    { key: "simpleHeader", label: "Enkel header", defaultValue: false },
    {
        key: "redirectOnUserChange",
        label: "Redirect ved brukerbytte",
        defaultValue: false,
    },
    { key: "pageType", label: "Sidetype", defaultValue: "direkte-test" },
];

const paramConfigsByLabel = [...paramConfigs].sort((a, b) =>
    a.label.localeCompare(b.label, "nb"),
);

const defaultDirectParams: DecoratorParams = {
    language: "en",
    context: "samarbeidspartner",
    availableLanguages: paramConfigs.find(
        ({ key }) => key === "availableLanguages",
    )?.defaultValue as DecoratorParams["availableLanguages"],
    breadcrumbs: paramConfigs.find(({ key }) => key === "breadcrumbs")
        ?.defaultValue as DecoratorParams["breadcrumbs"],
    chatbotVisible: true,
    simple: false,
};

const formatPayload = (params: DecoratorParams) =>
    JSON.stringify(params, null, 2);

const findParamConfig = (key: BuilderParamKey) =>
    paramConfigs.find((config) => config.key === key)!;

const cloneParams = (params: DecoratorParams): DecoratorParams =>
    JSON.parse(JSON.stringify(params)) as DecoratorParams;

const isEmptyParams = (params: DecoratorParams) =>
    Object.keys(params).length === 0;

const getResetParams = (routeParams: DecoratorParams): DecoratorParams => ({
    ...routeParams,
    availableLanguages: routeParams.availableLanguages ?? [],
    breadcrumbs: routeParams.breadcrumbs ?? [],
    chatbotVisible: false,
    redirectOnUserChange: false,
    simple: routeParams.simple ?? false,
    simpleHeader: false,
    simpleFooter: false,
    utilsBackground: "transparent",
});

const routeTargets: Array<{
    key: RouteTargetKey;
    label: string;
    pathname: string;
}> = [
    { key: "frontpage", label: "Forside", pathname: "/" },
    { key: "arbeidsgiver", label: "Arbeidsgiver", pathname: "/arbeidsgiver" },
    { key: "person", label: "Person", pathname: "/person" },
    { key: "sak123", label: "Sak 123", pathname: "/sak/123" },
    { key: "sak456", label: "Sak 456", pathname: "/sak/456" },
];

const urlParamKeys = [
    "language",
    "context",
    "simple",
    "chatbotVisible",
] satisfies BuilderParamKey[];

const navigationParamKeySet = new Set<BuilderParamKey>(urlParamKeys);

const getParamConfigsForMode = (mode?: WorkflowMode) => {
    if (!mode) {
        return [];
    }

    return mode === "navigation"
        ? paramConfigsByLabel.filter(({ key }) =>
              navigationParamKeySet.has(key),
          )
        : paramConfigsByLabel;
};

const getNavigationParams = (params: DecoratorParams) =>
    Object.fromEntries(
        urlParamKeys
            .filter((key) => params[key] !== undefined)
            .map((key) => [key, params[key]]),
    ) as DecoratorParams;

const formatPreviewValue = (value: unknown) => JSON.stringify(value);

const buildNavigationHref = (
    routeTarget: RouteTargetKey,
    params: DecoratorParams,
) => {
    const target = routeTargets.find(({ key }) => key === routeTarget)!;
    const searchParams = new URLSearchParams();

    Object.entries(getNavigationParams(params)).forEach(([key, value]) =>
        searchParams.set(key, String(value)),
    );

    const query = searchParams.toString();

    return query ? `${target.pathname}?${query}` : target.pathname;
};

const getBreadcrumbPreset = (breadcrumbs: DecoratorParams["breadcrumbs"]) => {
    const lastTitle = breadcrumbs?.at(-1)?.title;

    if (!breadcrumbs || breadcrumbs.length === 0) {
        return "none";
    }

    if (lastTitle === "Søknad om sykepenger") {
        return "application";
    }

    if (lastTitle === "Inntektsmelding") {
        return "employer";
    }

    return "person";
};

const breadcrumbPresets = {
    none: [],
    person: [
        { title: "Forside", url: "https://www.nav.no" },
        {
            title: "Sykepenger",
            url: "/person/sykepenger",
            handleInApp: true,
        },
    ],
    application: [
        { title: "Forside", url: "https://www.nav.no" },
        {
            title: "Sykepenger",
            url: "/person/sykepenger",
            handleInApp: true,
        },
        {
            title: "Søknad om sykepenger",
            url: "/person/sykepenger/soknad",
            handleInApp: true,
        },
    ],
    employer: [
        {
            title: "Min side arbeidsgiver",
            url: "https://www.nav.no/min-side-arbeidsgiver",
        },
        {
            title: "Inntektsmelding",
            url: "/arbeidsgiver/inntektsmelding",
            handleInApp: true,
        },
    ],
} satisfies Record<string, DecoratorParams["breadcrumbs"]>;

const availableLanguagePresets = {
    none: [],
    nbEn: [
        { locale: "nb", handleInApp: true },
        { locale: "en", handleInApp: true },
    ],
    nbNnEn: [
        { locale: "nb", handleInApp: true },
        { locale: "nn", handleInApp: true },
        { locale: "en", handleInApp: true },
    ],
} satisfies Record<string, DecoratorParams["availableLanguages"]>;

const getAvailableLanguagePreset = (
    languages: DecoratorParams["availableLanguages"],
) => {
    const locales = languages?.map(({ locale }) => locale).join(",");

    if (!locales) {
        return "none";
    }

    return locales === "nb,nn,en" ? "nbNnEn" : "nbEn";
};

const getAvailableParamConfigs = (
    params: DecoratorParams,
    mode?: WorkflowMode,
) =>
    getParamConfigsForMode(mode).filter(({ key }) => params[key] === undefined);

const getFirstAvailableParamKey = (
    params: DecoratorParams,
    mode: WorkflowMode = "payload",
) => getAvailableParamConfigs(params, mode)[0]?.key ?? "language";

export default function ParamBuilder({ initialPath, title }: Props) {
    const router = useRouter();
    const [directParamsUpdate, setDirectParamsUpdate] =
        useState<DirectParamsUpdate>();
    const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("payload");
    const [directParams, setDirectParams] = useState<DecoratorParams>({});
    const [paramToAdd, setParamToAdd] = useState<BuilderParamKey>(() =>
        getFirstAvailableParamKey({}),
    );
    const [routeTarget, setRouteTarget] = useState<RouteTargetKey>("frontpage");
    const path = useSyncExternalStore(
        emptySubscribe,
        () => (router.isReady ? router.asPath : router.pathname),
        () => initialPath,
    );
    const routeParams = buildDecoratorParams(path);
    const decoratorParams =
        directParamsUpdate?.path === path
            ? { ...routeParams, ...directParamsUpdate.params }
            : routeParams;
    const selectedParamKeys = getParamConfigsForMode(workflowMode)
        .map(({ key }) => key)
        .filter((key) => directParams[key] !== undefined);
    const availableParamConfigs = getAvailableParamConfigs(
        directParams,
        workflowMode,
    );
    const selectedParamToAdd = availableParamConfigs.some(
        ({ key }) => key === paramToAdd,
    )
        ? paramToAdd
        : getFirstAvailableParamKey(directParams, workflowMode);
    const navigationHref = buildNavigationHref(routeTarget, directParams);
    const selectedRouteTarget = routeTargets.find(
        ({ key }) => key === routeTarget,
    )!;
    const navigationBaseParams = buildDecoratorParams(
        selectedRouteTarget.pathname,
    );
    const navigationResultParams = buildDecoratorParams(navigationHref);
    const navigationAppliedParamKeys = new Set(
        Object.keys(getNavigationParams(directParams)),
    );
    const setDirectParam = (
        key: BuilderParamKey,
        value: DecoratorParams[BuilderParamKey],
    ) => {
        setDirectParams({ ...directParams, [key]: value });
    };
    const removeDirectParam = (key: BuilderParamKey) => {
        const nextParams: Record<string, unknown> = { ...directParams };

        delete nextParams[key];
        setDirectParams(nextParams as DecoratorParams);
        setParamToAdd(
            getFirstAvailableParamKey(
                nextParams as DecoratorParams,
                workflowMode,
            ),
        );
    };
    const addDirectParam = () => {
        const config = findParamConfig(selectedParamToAdd);
        const nextParams = {
            ...directParams,
            [config.key]: config.defaultValue,
        };

        setDirectParams(nextParams);
        setParamToAdd(getFirstAvailableParamKey(nextParams, workflowMode));
    };
    const prefillDirectParams = () => {
        const prefilledParams =
            workflowMode === "navigation"
                ? getNavigationParams(defaultDirectParams)
                : defaultDirectParams;

        setDirectParams(prefilledParams);
        setParamToAdd(getFirstAvailableParamKey(prefilledParams, workflowMode));
    };
    const clearDirectParams = () => {
        setDirectParams({});
        setParamToAdd(getFirstAvailableParamKey({}, workflowMode));
    };
    const selectWorkflowMode = (mode: WorkflowMode) => {
        setWorkflowMode(mode);
        setParamToAdd(getFirstAvailableParamKey(directParams, mode));
    };
    const emitDirectParams = (channel: "moduler" | "postMessage") => {
        const params = cloneParams(directParams);
        const payload = isEmptyParams(params)
            ? getResetParams(routeParams)
            : params;

        if (channel === "moduler") {
            void setParams(payload);
        } else {
            window.postMessage(
                {
                    source: "decoratorClient",
                    event: "params",
                    payload,
                },
                window.location.origin,
            );
        }

        if (isEmptyParams(params)) {
            setDirectParamsUpdate(undefined);
        } else {
            setDirectParamsUpdate({ path, params });
        }
    };
    const renderParamControl = (key: BuilderParamKey) => {
        switch (key) {
            case "language":
                return (
                    <Select
                        label="Språk"
                        size="small"
                        value={directParams.language}
                        onChange={(event) =>
                            setDirectParam("language", event.target.value)
                        }
                    >
                        <option value="nb">Norsk bokmål</option>
                        <option value="nn">Norsk nynorsk</option>
                        <option value="en">Engelsk</option>
                        <option value="se">Samisk</option>
                        <option value="pl">Polsk</option>
                        <option value="uk">Ukrainsk</option>
                        <option value="ru">Russisk</option>
                    </Select>
                );
            case "context":
                return (
                    <Select
                        label="Context"
                        size="small"
                        value={directParams.context}
                        onChange={(event) =>
                            setDirectParam("context", event.target.value)
                        }
                    >
                        <option value="privatperson">Privatperson</option>
                        <option value="arbeidsgiver">Arbeidsgiver</option>
                        <option value="samarbeidspartner">
                            Samarbeidspartner
                        </option>
                    </Select>
                );
            case "availableLanguages":
                return (
                    <Select
                        label="Tilgjengelige språk"
                        size="small"
                        value={getAvailableLanguagePreset(
                            directParams.availableLanguages,
                        )}
                        onChange={(event) =>
                            setDirectParam(
                                "availableLanguages",
                                availableLanguagePresets[
                                    event.target
                                        .value as keyof typeof availableLanguagePresets
                                ],
                            )
                        }
                    >
                        <option value="none">Ingen</option>
                        <option value="nbEn">Bokmål og engelsk</option>
                        <option value="nbNnEn">
                            Bokmål, nynorsk og engelsk
                        </option>
                    </Select>
                );
            case "breadcrumbs":
                return (
                    <Select
                        label="Brødsmuler"
                        size="small"
                        value={getBreadcrumbPreset(directParams.breadcrumbs)}
                        onChange={(event) =>
                            setDirectParam(
                                "breadcrumbs",
                                breadcrumbPresets[
                                    event.target
                                        .value as keyof typeof breadcrumbPresets
                                ],
                            )
                        }
                    >
                        <option value="none">Ingen</option>
                        <option value="person">Person: sykepenger</option>
                        <option value="application">
                            Person: søknad om sykepenger
                        </option>
                        <option value="employer">
                            Arbeidsgiver: inntektsmelding
                        </option>
                    </Select>
                );
            case "utilsBackground":
                return (
                    <Select
                        label="Bakgrunn for brødsmuler/språk"
                        size="small"
                        value={directParams.utilsBackground}
                        onChange={(event) =>
                            setDirectParam(
                                "utilsBackground",
                                event.target.value,
                            )
                        }
                    >
                        <option value="transparent">Transparent</option>
                        <option value="white">Hvit</option>
                        <option value="gray">Grå</option>
                    </Select>
                );
            case "pageType":
                return (
                    <TextField
                        label={findParamConfig(key).label}
                        size="small"
                        value={String(directParams[key] ?? "")}
                        onChange={(event) =>
                            setDirectParam(key, event.target.value)
                        }
                    />
                );
            default:
                return (
                    <Checkbox
                        size="small"
                        checked={Boolean(directParams[key])}
                        onChange={(event) =>
                            setDirectParam(key, event.target.checked)
                        }
                    >
                        {findParamConfig(key).label}
                    </Checkbox>
                );
        }
    };

    return (
        <Box
            as="main"
            className={styles.main}
            paddingBlock="space-12 space-32"
            paddingInline={{ xs: "space-16", md: "space-48" }}
        >
            <VStack gap="space-16">
                <Heading level="1" size="large">
                    {title}
                </Heading>

                <Box
                    as="section"
                    background="neutral-soft"
                    borderColor="neutral-subtle"
                    borderWidth="1"
                    borderRadius="8"
                    padding="space-12"
                    aria-labelledby="route-state"
                >
                    <VStack gap="space-8">
                        <Heading level="2" size="small" id="route-state">
                            Dekoratøren status
                        </Heading>
                        <pre className={styles.codeBlock}>
                            {formatParams(decoratorParams)}
                        </pre>
                    </VStack>
                </Box>

                <Box
                    as="section"
                    background="neutral-soft"
                    borderColor="neutral-subtle"
                    borderWidth="1"
                    borderRadius="8"
                    padding="space-12"
                    aria-labelledby="direct-updates"
                >
                    <VStack gap="space-12">
                        <Heading level="2" size="small" id="direct-updates">
                            Bygg testparametre
                        </Heading>

                        <ToggleGroup
                            size="small"
                            aria-label="Velg workflow"
                            data-color="accent"
                            value={workflowMode}
                            onChange={(value) =>
                                selectWorkflowMode(value as WorkflowMode)
                            }
                        >
                            <ToggleGroup.Item
                                value="payload"
                                label="Parameteroppdatering"
                            />
                            <ToggleGroup.Item
                                value="navigation"
                                label="Navigasjon"
                            />
                        </ToggleGroup>

                        {workflowMode === "navigation" && (
                            <Select
                                label="Rute"
                                size="small"
                                className={styles.compactSelect}
                                value={routeTarget}
                                onChange={(event) =>
                                    setRouteTarget(
                                        event.target.value as RouteTargetKey,
                                    )
                                }
                            >
                                {routeTargets.map(({ key, label }) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        )}

                        <HStack gap="space-8" align="end" wrap>
                            <Select
                                label="Legg til parameter"
                                size="small"
                                className={styles.compactSelect}
                                value={selectedParamToAdd}
                                onChange={(event) =>
                                    setParamToAdd(
                                        event.target.value as BuilderParamKey,
                                    )
                                }
                                disabled={availableParamConfigs.length === 0}
                            >
                                {availableParamConfigs.map(({ key, label }) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                type="button"
                                size="small"
                                variant="secondary"
                                data-color="neutral"
                                onClick={addDirectParam}
                                disabled={availableParamConfigs.length === 0}
                            >
                                Legg til
                            </Button>
                            <Button
                                type="button"
                                size="small"
                                variant="secondary"
                                data-color="neutral"
                                onClick={clearDirectParams}
                                disabled={selectedParamKeys.length === 0}
                            >
                                Fjern alle
                            </Button>
                            <Button
                                type="button"
                                size="small"
                                variant="secondary"
                                data-color="neutral"
                                onClick={prefillDirectParams}
                            >
                                Fyll inn eksempel
                            </Button>
                        </HStack>

                        {selectedParamKeys.length > 0 ? (
                            <Box className={styles.paramGroup}>
                                {selectedParamKeys.map((key) => (
                                    <HStack
                                        key={key}
                                        align="end"
                                        gap="space-8"
                                        className={styles.paramRow}
                                    >
                                        <Box className={styles.paramControl}>
                                            {renderParamControl(key)}
                                        </Box>
                                        <Button
                                            type="button"
                                            size="small"
                                            variant="primary"
                                            data-color="danger"
                                            className={styles.paramRemoveButton}
                                            aria-label={`Fjern ${findParamConfig(key).label}`}
                                            onClick={() =>
                                                removeDirectParam(key)
                                            }
                                        >
                                            ×
                                        </Button>
                                    </HStack>
                                ))}
                            </Box>
                        ) : null}

                        <Box
                            as="section"
                            aria-labelledby={`${workflowMode}-preview`}
                            className={styles.previewWrapper}
                        >
                            <VStack gap="space-8">
                                <Heading
                                    level="3"
                                    size="xsmall"
                                    id={`${workflowMode}-preview`}
                                >
                                    Forhåndsvisning
                                </Heading>

                                {workflowMode === "navigation" ? (
                                    <>
                                        <pre className={styles.codeBlock}>
                                            {"{\n"}
                                            {Object.entries(
                                                navigationResultParams,
                                            ).map(
                                                (
                                                    [key, value],
                                                    index,
                                                    entries,
                                                ) => {
                                                    const appliedParam =
                                                        navigationAppliedParamKeys.has(
                                                            key,
                                                        );
                                                    const baseValue =
                                                        navigationBaseParams[
                                                            key as BuilderParamKey
                                                        ];
                                                    const overridesRouteValue =
                                                        appliedParam &&
                                                        baseValue !==
                                                            undefined &&
                                                        JSON.stringify(
                                                            baseValue,
                                                        ) !==
                                                            JSON.stringify(
                                                                value,
                                                            );

                                                    return (
                                                        <span
                                                            key={key}
                                                            className={
                                                                appliedParam
                                                                    ? undefined
                                                                    : styles.previewRouteValue
                                                            }
                                                        >
                                                            {`  "${key}": `}
                                                            {overridesRouteValue ? (
                                                                <>
                                                                    <s
                                                                        className={
                                                                            styles.previewOldValue
                                                                        }
                                                                    >
                                                                        {formatPreviewValue(
                                                                            baseValue,
                                                                        )}
                                                                    </s>{" "}
                                                                    →{" "}
                                                                    <code>
                                                                        {formatPreviewValue(
                                                                            value,
                                                                        )}
                                                                    </code>
                                                                </>
                                                            ) : (
                                                                formatPreviewValue(
                                                                    value,
                                                                )
                                                            )}
                                                            {index <
                                                            entries.length - 1
                                                                ? ","
                                                                : ""}
                                                            {"\n"}
                                                        </span>
                                                    );
                                                },
                                            )}
                                            {"}"}
                                        </pre>
                                        <BodyShort
                                            size="small"
                                            className={styles.previewUrl}
                                        >
                                            URL: <code>{navigationHref}</code>
                                        </BodyShort>
                                    </>
                                ) : (
                                    <pre className={styles.codeBlock}>
                                        {formatPayload(directParams)}
                                    </pre>
                                )}
                            </VStack>
                        </Box>

                        {workflowMode === "navigation" ? (
                            <HStack gap="space-8" wrap>
                                <Button
                                    as={Link}
                                    href={navigationHref}
                                    size="small"
                                    variant="secondary"
                                >
                                    Naviger med Next Link
                                </Button>
                                <Button
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    onClick={() => router.push(navigationHref)}
                                >
                                    Naviger med router.push
                                </Button>
                                <Button
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    onClick={() =>
                                        router.replace(navigationHref)
                                    }
                                >
                                    Naviger med router.replace
                                </Button>
                            </HStack>
                        ) : (
                            <HStack gap="space-8" wrap>
                                <Button
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    onClick={() => emitDirectParams("moduler")}
                                >
                                    Oppdater via moduler
                                </Button>
                                <Button
                                    type="button"
                                    size="small"
                                    variant="secondary"
                                    onClick={() =>
                                        emitDirectParams("postMessage")
                                    }
                                >
                                    Oppdater via window.postMessage
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}
