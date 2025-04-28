import { readdir } from 'fs/promises';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadHandlers() {
  const handlers = {};
  const files = await readdir(__dirname);
  const handlerFiles = files.filter(file => file.endsWith('.mjs') && !file.startsWith('_'));

  for (const file of handlerFiles) {
    try {
      const type = basename(file, '.mjs');
      const module = await import(new URL(file, import.meta.url));
      handlers[type] = module.default;
    } catch (err) {
      console.error(`Failed to load handler from ${file}:`, err);
    }
  }

  return handlers;
}
