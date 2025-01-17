export const logPageView = () => {
    umami.track("besøk", { besok: "dekoratoren" });
};
