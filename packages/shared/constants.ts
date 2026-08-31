export const VERSION_ID_PARAM = "version-id";

export const languageLabels = {
    nb: "Norsk (bokmål)",
    nn: "Norsk (nynorsk)",
    en: "English",
    se: "Sámegiel (samisk)",
    pl: "Polski (polsk)",
    uk: "Українська (ukrainsk)",
    ru: "Русский (russisk)",
};

export const CONSUMER = "dekoratoren";

// Read by both the client controller (packages/client/src/webStorage.ts) and the
// server's pre-paint script (packages/server/src/views/consent-banner.ts).
// Bumping the version means the script has to be checked too.
export const CONSENT_COOKIE_NAME = "navno-consent";

// Changelog consent versioning
// --------------------------------
// (Remember to update this list when making changes that require re-consent)

// V5: 18.06.2026: Changes to the cookie statement, requiring consent reset for all users
// V4: 01.02.2026: Added analyticsId (uuid) to consent object for Umami user identification
// V3: 03.11.2025: Added storage key 'flexjar-*' as well as updates to cookie declaration
// V2: 22.10.2025: Updates in the cookie declaration on how Umami works.
// V1: 28.02.2025: Initial version
export const CURRENT_CONSENT_VERSION = 5;
