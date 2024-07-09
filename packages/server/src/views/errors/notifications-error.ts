import i18n from "../../i18n";
import { Alert } from "../alert";

export const NotificationsErrorView = () =>
    Alert({
        variant: "error",
        content: i18n("notifications_error"),
    });
