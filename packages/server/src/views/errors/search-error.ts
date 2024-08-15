import i18n from "../../i18n";
import { Alert } from "../components/alert";

export const SearchErrorView = () =>
    Alert({
        variant: "error",
        content: i18n("search_error"),
    });
