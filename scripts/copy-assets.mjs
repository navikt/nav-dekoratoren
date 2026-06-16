import { cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("packages/client/dist/assets");
const target = resolve("packages/server/public/assets");

mkdirSync(resolve("packages/server/public"), { recursive: true });
cpSync(source, target, { recursive: true });
