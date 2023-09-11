import { Router } from 'express';
import path from 'path';

const router = Router();

const resources = (
  await import('../../dist/manifest.json', { assert: { type: 'json' } })
).default;

const getFile = (entrypoint: string) => {
  const filepath = resources[entrypoint].file;
  return path.resolve(path.join('./dist', filepath));
};

router.get('/client.js', (req, res) => {
  res.sendFile(getFile('client/main.ts'));
});

router.get('/main.css', (req, res) => {
  res.sendFile(getFile('client/main.css'));
});

export default router;
