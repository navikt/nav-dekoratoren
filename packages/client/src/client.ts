// This is the script that runs when the application uses client side rendering.
// 1. Get other scripts and stylesheets
// #### Client-side rendering
//
// Obs! CSR vil gi en redusert brukeropplevelse pga layout-shifting/"pop-in" når headeren rendres, og bør unngås om mulig.
//
// Sett inn noen linjer i HTML-templaten:
//
// ```
    // <html>
//   <head>
//       <link href="{MILJO_URL}/css/client.css" rel="stylesheet" />
//   </head>
//   <body>
//     <div id="decorator-header"></div>
//     {
//       DIN_APP
    //     }
//     <div id="decorator-footer"></div>
//     <div id="decorator-env" data-src="{MILJO_URL}/env?{DINE_PARAMETERE}"></div>
//     <script async="true" src="{MILJO_URL}/client.js"></script>
//   </body>
// </html>
// ```
// Check if the decorator is already loaded. If not, load it from env.
// Maybe env can respond with header, footer and data?
async function hydrate() {
    const decoratorHeader = document.getElementById('decorator-header');
    const decoratorFooter = document.getElementById('decorator-footer');
    const decoratorEnv = document.getElementById('decorator-env');

    if (!decoratorHeader || !decoratorFooter || !decoratorEnv) {
        console.error('Could not find decorator elements');
            return;
    }

    const envUrl = decoratorEnv.dataset.src as string;

    const response = await fetch(envUrl)

}


hydrate();
