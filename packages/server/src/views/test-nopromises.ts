const entryPointPath = 'src/main.ts';
const entryPointPathAnalytics = 'src/analytics/analytics.ts';

const getManifest = async () =>
  (await import('decorator-client/dist/manifest.json')).default;

const manifest = await getManifest();

const Links = () =>
  process.env.NODE_ENV === 'production'
    ? [
        ...manifest[entryPointPath].css.map(
          (href: string) =>
            `<link type="text/css" rel="stylesheet" href="${
              process.env.HOST ?? ``
            }/public/${href}"></link>`,
        ),
      ].join('')
    : '';

// This can be calcualted once at startup
const Scripts = () => {
  const script = (src: string) =>
    `<script type="module" src="${src}"></script>`;

  const partytownScript = (src: string) =>
    `<script type="text/partytown" src="${src}"></script>"`;

  // const manifest = await getManifest();

  return process.env.NODE_ENV === 'production'
    ? [
        script(
          `${process.env.HOST ?? ``}/public/${manifest[entryPointPath].file}`,
        ),
        partytownScript(
          `${process.env.HOST ?? ``}/public/${
            manifest[entryPointPathAnalytics].file
          }`,
        ),
      ].join('')
    : [
        [
          'http://localhost:5173/@vite/client',
          `http://localhost:5173/${entryPointPath}`,
        ]
          .map(script)
          .join(''),
        [
          `${process.env.HOST ?? ``}/public/${
            manifest[entryPointPathAnalytics].file
          }`,
        ]
          .map(partytownScript)
          .join(''),
      ].join('');
};

const count = 1000 * 1000;

function test() {
  Scripts();
  Links();
}

for (let i = 0; i < count; i++) {
  test();
}

const secondsUsed = Bun.nanoseconds() / 1000000000;
const used = process.memoryUsage().heapUsed / (1024 * 1024);

console.log(process.memoryUsage());

console.log(`Memory used: ${used} MB`);
console.log(`Seconds used: ${secondsUsed} seconds`);
