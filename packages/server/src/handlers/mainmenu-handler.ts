import { validParams } from "../validateParams";
import { texts } from "../texts";
import { makeFrontpageUrl } from "decorator-shared/urls";
import { env } from "../env/server";
import { MainMenu } from "../views/header/main-menu";
import { getMainMenuLinks, mainMenuContextLinks } from "../menu/main-menu";
import { HandlerFunction, responseBuilder } from "../lib/handler";

export const mainmenuHandler: HandlerFunction = async ({ query }) => {
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

    return responseBuilder()
        .html(
            MainMenu({
                title:
                    data.context === "privatperson"
                        ? localTexts.how_can_we_help
                        : localTexts[`rolle_${data.context}`],
                frontPageUrl,
                texts: localTexts,
                links,
                contextLinks,
            }).render(),
        )
        .build();
};
