import { makeFrontpageUrl } from "decorator-shared/urls";
import i18n from "../../i18n";
import { MainMenu } from "./main-menu";
import { env } from "../../env/server";
import { getMainMenuLinks, mainMenuContextLinks } from "../../menu/main-menu";
import { Params } from "decorator-shared/params";

export async function MainMenuTemplate({ data }: { data: Params }) {
    return MainMenu({
        title:
            data.context === "privatperson"
                ? i18n("how_can_we_help")
                : i18n(data.context),
        frontPageUrl: makeFrontpageUrl({
            context: data.context,
            language: data.language,
            baseUrl: env.XP_BASE_URL,
        }),
        links: await getMainMenuLinks({
            language: data.language,
            context: data.context,
        }),
        contextLinks: mainMenuContextLinks({
            context: data.context,
            language: data.language,
            bedrift: data.bedrift,
        }),
    });
}
