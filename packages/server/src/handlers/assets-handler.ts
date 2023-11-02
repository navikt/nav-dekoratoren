// import { Handler } from "../lib/handler"
import { NodeEnv } from "../env/schema"
import { env } from "../env/server"
import { Handler } from "../lib/handler";
import { entryPointPath, getManifest } from "../views";


type Assets = {
    js: string;
    css: string;
}

type AssetsLoader = () => Promise<Assets>

// Bun.file is relative to --cwd flag
const publicPath = (path: string) => `./public/${path}`

// Loading same for both now, but may be usefull later to be able to differentiate
const loadAssets: AssetsLoader = async () => {
    const manifest = await getManifest()

    const js = await Bun.file(publicPath(manifest[entryPointPath].file)).text()
    const css = await Bun.file(publicPath(manifest[entryPointPath].css[0])).text()

    return {
        js,
        css,
    }
}

const loaders: Record<NodeEnv, AssetsLoader> = {
    production: loadAssets,
    development: loadAssets
}


const assets = await loaders[env.NODE_ENV]()

const scriptHandler: Handler = {
    method: 'GET',
    path: '/client.js',
    handler: () => {
       return new Response(assets.js, {
           headers: {
               'content-type': 'application/javascript; charset=utf-8',
                // @TODO: REplace with proper implementation
                'Access-Control-Allow-Origin': '*'
           }
       })
    }
}

const cssHandler: Handler = {
    method: 'GET',
    path: '/css/client.css',
    handler: () => {
       return new Response(assets.css, {
           headers: {
               'content-type': 'text/css; charset=utf-8',
           }
       })
    }
}


export const assetsHandlers = [
    scriptHandler,
    cssHandler
]

