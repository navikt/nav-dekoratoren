import i18n from "../../i18n";
import { Alert } from "../alert";

export const SearchErrorView = () =>
    Alert({
        variant: "error",
        content: i18n("search_error"),
    });
