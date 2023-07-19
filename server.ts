import express from "express";
import mustacheExpress from "mustache-express";
import { Params, parseParams } from "./params";

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", `${__dirname}/views`);

app.use("/public", express.static("public"));

const getTexts = async (params: Params): Promise<object> => {
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
    nb: {
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
    nb: "no.Footer.Columns.Privatperson",
    "": "no.Footer.Columns.Privatperson",
  };

  const footerLinks = get(menu, key[params.language])?.children;
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
    ...texts[params.language],
  };
};

app.use("/footer", async (req, res) => {
  const params = parseParams(req.query);

  if (params.success) {
    res.render("footer", {
      simple: params.data.simple,
      ...(await getTexts(params.data)),
    });
  } else {
    res.status(400).send(params.error);
  }
});

app.use<{ lang: string }, {}, {}, { simple: string }>(
  "/:lang?",
  async (req, res) => {
    const params = parseParams(req.query);

    if (params.success) {
      res.render("index", {
        simple: params.data.simple,
        lang: { [params.data.language]: true },
        ...(await getTexts(params.data)),
      });
    } else {
      res.status(400).send(params.error);
    }
  }
);

app.listen(3000, function () {
  console.log("Server started");
});
