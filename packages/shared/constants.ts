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

// The consent banner state (pending | decided | reshow) lives in the data-state
// attribute of an empty <style> in <head> with this id, and consent-banner.module.css
// shows the banner off it with html:has(). Keep the id in sync with that file.
//
// It deliberately isn't an attribute on <html>: consumers rendering the document
// with React (e.g. the Next App Router) hand <html> to React, which reports any
// attribute it didn't render as a hydration mismatch, and strips them all if it
// ever has to client-render the root. React skips foreign elements in <head> when
// hydrating, and keeps <style> elements when it clears <head>.
export const CONSENT_STATE_ELEMENT_ID = "decorator-consent-state";

// Changelog consent versioning
// --------------------------------
// (Remember to update this list when making changes that require re-consent)

// V5: 18.06.2026: Changes to the cookie statement, requiring consent reset for all users
// V4: 01.02.2026: Added analyticsId (uuid) to consent object for Umami user identification
// V3: 03.11.2025: Added storage key 'flexjar-*' as well as updates to cookie declaration
// V2: 22.10.2025: Updates in the cookie declaration on how Umami works.
// V1: 28.02.2025: Initial version
export const CURRENT_CONSENT_VERSION = 5;
