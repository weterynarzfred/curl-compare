import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadHandlers() {
  const handlers = {};
  const files = await fs.readdir(__dirname);

  for (const file of files) {
    if (file.endsWith('.mjs')) {
      const type = path.basename(file, '.mjs');
      handlers[type] = (await import(`./${file}`)).default;
    }
  }

  return handlers;
}
