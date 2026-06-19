import { AvailableLanguage, Language } from "decorator-shared/params";
import { LanguageSelector as SharedLanguageSelector } from "decorator-shared/views/language-selector";
import i18n from "../i18n";

export type LanguageSelectorProps = {
    availableLanguages: AvailableLanguage[];
    language: Language;
};

export const LanguageSelector = ({
    availableLanguages,
    language,
}: LanguageSelectorProps) =>
    SharedLanguageSelector({
        availableLanguages,
        language,
        label: i18n("language_selector"),
    });
