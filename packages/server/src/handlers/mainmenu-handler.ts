import { makeFrontpageUrl } from "decorator-shared/urls";
import { env } from "../env/server";
import { getMainMenuLinks, mainMenuContextLinks } from "../menu/main-menu";
import { texts } from "../texts";
import { validParams } from "../validateParams";
import { MainMenu } from "../views/header/main-menu";

export const mainmenuHandler = async ({
    query,
}: {
    query: Record<string, string>;
}) => {
    const data = validParams(query);
    const localTexts = texts[data.language];

    const frontPageUrl = makeFrontpageUrl({
        context: data.context,
        language: data.language,
        baseUrl: env.XP_BASE_URL,
    });

    const contextLinks = mainMenuContextLinks({
        context: data.context,
        bedrift: data.bedrift,
    });

    const links = await getMainMenuLinks({
        language: data.language,
        context: data.context,
    });

    return MainMenu({
        title:
            data.context === "privatperson"
                ? localTexts.how_can_we_help
                : localTexts[`rolle_${data.context}`],
        frontPageUrl,
        texts: localTexts,
        links,
        contextLinks,
    }).render();
};
