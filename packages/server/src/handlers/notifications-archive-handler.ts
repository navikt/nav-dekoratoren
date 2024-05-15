import { archiveNotification } from "../notifications";
import { HandlerFunction, responseBuilder } from "../lib/handler";

export const notificationsArchiveHandler: HandlerFunction = async ({
    request,
    query,
}) => {
    const result = await archiveNotification({
        request,
        id: query.id,
    });

    if (result.ok) {
        return responseBuilder().json(result.data).build();
    } else {
        console.error(
            `Error archiving notifcation ${query.id} - ${result.error.message}`,
        );
        return responseBuilder()
            .status(500)
            .json({ error: result.error.message })
            .build();
    }
};
