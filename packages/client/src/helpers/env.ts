export const isProd = () => {
    return (
        window.location.hostname.endsWith(".nav.no") &&
        !window.location.hostname.endsWith(".dev.nav.no")
    );
};
