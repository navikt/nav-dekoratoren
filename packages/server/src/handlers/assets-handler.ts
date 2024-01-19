// import { Handler } from "../lib/handler"
import { Handler } from "../lib/handler";
import { cdnUrl, getManifest } from "../views";


const manifest = await getManifest()
const csrManifest = manifest['src/csr.ts']
const mainManifest = manifest['src/main.ts']
const csrScriptUrl = cdnUrl(csrManifest.file)
const cssUrl = cdnUrl(mainManifest.css[0])

const scriptHandler: Handler = {
    method: 'GET',
    path: '/client.js',
    handler: () => {
       return new Response(null, {
           status: 301,
           headers: {
               'Location': csrScriptUrl,
               'content-type': 'application/javascript; charset=utf-8',
           }
       })
    }
}

const cssHandler: Handler = {
    method: 'GET',
    path: '/css/client.css',
    handler: () => {
        // assets.css
       return new Response(null, {
            status: 301,
           headers: {
               'Location': cssUrl,
               'content-type': 'text/css; charset=utf-8',
           }
       })
    }
}


export const assetsHandlers = [
    scriptHandler,
    cssHandler
]

