import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { Context, Params, parseParams } from "./params";
import cors from "cors";
import { capitalizeFirstLetter } from "./utils";
import { Index } from "./views";
import { texts } from "./texts";
import { Footer } from "./views/footer";
import { HeaderMenuLinks } from "./views/header-menu-links";

const isProd = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());
app.use(express.static(isProd ? "dist" : "public"));

function getContextKey(context: Context) {
  return capitalizeFirstLetter(context);
}

app.use((req, res, next) => {
  const result = parseParams(req.query);

  if (result.success) {
    req.decorator = result.data;
  } else {
    res.status(400).send(result.error);
  }

  next();
});

export const getData = async (params: Params) => {
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
  const headerMenuLinks = get(menu, menuLinksKey[params.language])?.children;

  if (!mainMenu || !footerLinks || !personvern || !headerMenuLinks) {
      throw new Error("Main menu or footer links not found");
  }

  return {
    footerLinks,
    mainMenu: mainMenu.map((contextLink) => {
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
    texts: texts[params.language],
  };
};


type GetDataResponse = Awaited<ReturnType<typeof getData>>;
// These types are the same for now, but if we change later i want it to be reflected which is why i'm doing this.
export type MainMenu = GetDataResponse["mainMenu"];
export type FooterLinks = GetDataResponse["footerLinks"];
export type Personvern = GetDataResponse["personvern"];
export type HeaderMenuLinksData = GetDataResponse["headerMenuLinks"];

app.use("/footer", async (req, res) => {
  const params = req.decorator;
  // Maybe make into middleware
  const data = await getData(params);

  return res.status(200).send(Footer({
      simple: req.decorator.simple,
      personvern: data.personvern,
      footerLinks: data.footerLinks,
      texts: data.texts
  }));
});

app.use("/header", async (req, res) => {
  const params = req.decorator;
  const data = await getData(params);
  return res.status(200).send(HeaderMenuLinks({
      headerMenuLinks: data.headerMenuLinks,
  }));
});

app.use("/", async (req, res) => {
  const scriptsAndLinks = () => {
    const script = (src: string) =>
      `<script type="module" src="${src}"></script>`;

    const entryPointPath = "client/main.ts";

    if (isProd) {
      const resources: { file: string; css: string[] } =
        require("./dist/manifest.json")[entryPointPath];
      return [
        script(resources.file),
        ...resources.css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${href}"></link>`
        ),
      ].join("");
    } else {
      return [
        "http://localhost:5173/@vite/client",
        `http://localhost:5173/${entryPointPath}`,
        "/dev-client.js",
      ]
        .map(script)
        .join("");
    }
  };


  const data = await getData(req.decorator);

  res.status(200)
  .send(Index({
      scriptsAndLinks: scriptsAndLinks(),
      language: req.decorator.language,
      headerProps: {
          texts: data.texts,
          mainMenu: data.mainMenu,
          headerMenuLinks: data.headerMenuLinks,
          innlogget: false,
          isNorwegian: true
      },
      footerProps: {
          texts: data.texts,
          personvern: data.personvern,
          footerLinks: data.footerLinks,
          simple: req.decorator.simple
      }
  }))
});

const server = http.createServer(app);

if (!isProd) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) =>
    wss.handleUpgrade(request, socket, head, (ws) =>
      ws.emit("connection", ws, request)
    )
  );
}

server.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});
