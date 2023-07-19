import express, { Request } from "express";
import mustacheExpress from "mustache-express";
import { Params, parseParams } from "./params";

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", `${__dirname}/views`);

app.use("/public", express.static("public"));

const getTexts = async (lang: string, params: Params): Promise<object> => {
  interface Node {
    children: Node[];
    displayName: string;
  }

  const get = (node: Node, path: string): Node | undefined => {
    if (path.includes(".")) {
      return path
        .split(".")
        .reduce<Node>((prev, curr) => get(prev, curr)!, node);
    }
    return node.children.find(({ displayName }) => displayName === path);
  };

  const texts: { [lang: string]: { [key: string]: string } } = {
    no: {
      share_screen: "Del skjerm med veileder",
      to_top: "Til toppen",
    },
    en: {
      share_screen: "Share screen with your counsellor",
      to_top: "To the top",
    },
    se: {
      share_screen: "Del skjerm med veileder",
      to_top: "Til toppen",
    },
  };

  const menu = {
    children: await fetch("https://www.nav.no/dekoratoren/api/meny").then(
      (response) => response.json()
    ),
    displayName: "",
  };

  const key: { [key: string]: string } = {
    en: "en.Footer.Columns",
    se: "se.Footer.Columns",
    no: "no.Footer.Columns.Privatperson",
    "": "no.Footer.Columns.Privatperson",
  };

  const footerLinks = get(menu, key[lang])?.children;
  const mainMenu = get(menu, "no.Header.Main menu")?.children;
  const personvern = get(menu, "no.Footer.Personvern")?.children;
  return {
    footerLinks,
    mainMenu: mainMenu?.map((contextLink) => {
      return {
        styles:
          contextLink.displayName.toLowerCase() === params.context
            ? "font-bold border-[#3386e0]"
            : "border-transparent",
        context: contextLink.displayName.toLowerCase(),
        ...contextLink,
      };
    }),
    personvern,
    ...texts[lang],
  };
};

app.use<{}, {}, {}, { simple: string; lang: string }>(
  "/footer",
  async (req, res) => {
    const lang = ["en", "se"].includes(req.query.lang) ? req.query.lang : "no";
    const simple = req.query.simple === "";
    const params = parseParams(req.query);

    res.render("footer", { simple, ...(await getTexts(lang, params)) });
  }
);

app.use<{ lang: string }, {}, {}, { simple: string }>(
  "/:lang?",
  async (req, res) => {
    const lang = ["en", "se"].includes(req.params.lang)
      ? req.params.lang
      : "no";

    const simple = req.query.simple === "";
    const params = parseParams(req.query);

    res.render("index", {
      simple,
      lang: { [lang]: true },
      ...(await getTexts(lang, params)),
    });
  }
);

app.listen(3000, function () {
  console.log("Server started");
});
