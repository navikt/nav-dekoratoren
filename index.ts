"use strict";

import Fastify from "fastify";
import fastifyView from "@fastify/view";
import mustache from "mustache";
import fastifyStatic from "@fastify/static";
import path from "path";
import { parseParams } from "./params";

const fastify = Fastify();

fastify.register(fastifyView, { engine: { mustache } });
fastify.register(fastifyStatic, { root: path.join(__dirname, "public") });

interface Node {
  children: Node[];
  displayName: string;
}

const get = (node: Node, path: string): Node | undefined => {
  if (path.includes(".")) {
    return path.split(".").reduce<Node>((prev, curr) => get(prev, curr)!, node);
  }
  return node.children.find(({ displayName }) => displayName === path);
};

fastify.get("/", async (req, reply) => {
  try {
    const menu = {
      children: await fetch("https://www.nav.no/dekoratoren/api/meny").then(
        (response) => response.json()
      ),
      displayName: "",
    };

    const footerLinks = get(menu, "no.Footer.Columns.Privatperson")?.children;
    const mainMenu = get(menu, "no.Header.Main menu")?.children;
    const personvern = get(menu, "no.Footer.Personvern")?.children;

    // Get typesafe parsed params
    const params = parseParams(req.query);

    return reply.view("/templates/index.mustache", {
      footerLinks,
      personvern,
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
    });
  } catch (e) {
    console.log(e);
  }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
