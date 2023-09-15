import { Router } from 'express';
import path from 'path';

const router = Router();

const resources = (
  await import('decorator-client/dist/manifest.json', {
    assert: { type: 'json' },
  })
).default;

console.log(resources);

const getFile = (entrypoint: string) => {
  const filepath = resources[entrypoint].file;
  return path.resolve(path.join('../../client/dist', filepath));
};

router.get('/client.js', (req, res) => {
  res.sendFile(getFile('src/main.ts'));
});

router.get('/main.css', (req, res) => {
  res.sendFile(getFile('src/main.css'));
});

export default router;
