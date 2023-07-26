import express from "express";
import mustacheExpress from "mustache-express";
import { Context, Params, parseParams } from "./params";
import cors from "cors";
import { capitalizeFirstLetter } from "./utils";
import { GetComponents } from "./components";

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", `${__dirname}/views`);

app.use(cors());
app.use(express.static("public"));

function getContextKey(context: Context)  {
    return capitalizeFirstLetter(context)
}

// How should we handle if the params are invalid?
app.use((req, res, next) => {
 const result = parseParams(req.query);
  if (result.success) {
    req.decorator = result.data;
  } else {
      res.status(400).send(result.error);
  }

  next();
})

app.use((req, res, next) => {
    res.components = GetComponents(res, req.decorator);
    next();
})

export const getTexts = async (params: Params): Promise<object> => {
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
      menu: "Meny",
      close: "Lukk",
    },
    en: {
      share_screen: "Share screen with your counsellor",
      to_top: "To the top",
      menu: "Menu",
      close: "Close",
    },
    se: {
      share_screen: "Del skjerm med veileder",
      to_top: "Til toppen",
      menu: "Meny",
      close: "Lukk",
    },
  };

  const menu = {
    children: await fetch("https://www.nav.no/dekoratoren/api/meny").then(
      (response) => response.json()
    ),
    displayName: "",
  };

  const contextKey = getContextKey(params.context);

  const key: { [key: string]: string } = {
    en: "en.Footer.Columns",
    se: "se.Footer.Columns",
    nb: `no.Footer.Columns.${contextKey}`,
    "": "no.Footer.Columns.Privatperson",
  };

  const menuLinksKey: { [key: string]: string } = {
    en: "en.Header.Main menu",
    se: "se.Header.Main menu",
    nb: `no.Header.Main menu.${contextKey}`,
    "": "no.Header.Main menu",
    };



  const footerLinks = get(menu, key[params.language])?.children;
  const mainMenu = get(menu, "no.Header.Main menu")?.children;
  const personvern = get(menu, "no.Footer.Personvern")?.children;
  const headerMenuLinks = get(
    menu,
    menuLinksKey[params.language]
  )?.children;

  return {
    footerLinks,
    mainMenu: mainMenu?.map((contextLink) => {
      return {
        styles:
          contextLink.displayName.toLowerCase() === params.context
            ? "active"
            : "",
        context: contextLink.displayName.toLowerCase(),
        ...contextLink,
      };
    }),
    isNorwegian: params.language === "nb",
    personvern,
    headerMenuLinks,
    ...texts[params.language],
  };
};

app.use("/footer", async (req, res) => {
  const params = req.decorator;

  return res.components.Footer({
    simple: params.simple,
    innlogget: false,
    ...(await getTexts(params)),
  })
});

app.use("/header", async (req, res) => {
    const params = req.decorator;

    return res.components.HeaderMenuLinks()
});

app.use("/", async (req, res) => {
    return res.components.Index("World")

    // res.render("index", {
    //   simple: params.data.simple,
    //   lang: { [params.data.language]: true },
    //   breadcrumbs: params.data.breadcrumbs.map((b, i, a) => ({
    //     ...b,
    //     last: a.length - 1 === i,
    //   })),
    //   ...(await getTexts(params.data)),
    // });
});

app.listen(3000, function () {
  console.log("Server started");
});
