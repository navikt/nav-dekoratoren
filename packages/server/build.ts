await Bun.build({
  entrypoints: ['./src/server.ts'],
  target: 'bun', // bun
  outdir: './dist',
});
