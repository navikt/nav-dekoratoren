export const isNavUrl = (url: string) => {
    const isLocalhost = /^(https?:\/\/localhost(:\d+)?)/i.test(url);
    const isPath = /^(\/)/i.test(url);
    const isNavOrNais =
        /^((https:\/\/([a-z0-9-]+[.])*((nav[.]no)|(nais[.]io)))($|\/))/i.test(
            url,
        );

    return isLocalhost || isPath || isNavOrNais;
};

export const isExternallyAvailable = (url: string) => {
    return url.includes("www.nav.no");
};
