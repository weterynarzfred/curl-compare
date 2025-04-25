import jsdom from 'jsdom';
import { JSONFilePreset } from 'lowdb/node';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import cliProgress from 'cli-progress';

import sources from './sources.mjs';
import consoleResults from './src/consoleResults.mjs';
import openLinks from "./src/openLinks.mjs";
import { loadHandlers } from "./handlers/_index.mjs";

const { JSDOM } = jsdom;
const db = await JSONFilePreset('db.json', {});
const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;
dayjs.extend(duration);
dayjs.extend(relativeTime);

console.log('\x1b[1m%s\x1b[0m', "\n# checking");
const bar = new cliProgress.SingleBar({
  format: '[{bar}] {value}/{total}',
  barsize: 80,
}, cliProgress.Presets.shades_classic);
bar.start(sources.length, 0);
const messages = {};
const errors = [];
const handlers = await loadHandlers();

for (let i = 0; i < sources.length; i++) {
  const source = sources[i];

  try {
    const dom = await JSDOM.fromURL(source.url);
    let list;

    const handler = handlers[source.type];
    if (!handler) throw new Error('Unknown source type');
    list = handler(dom, source);

    const sourceData = db.data[source.url] ?? { list: [], lastCheck: 0, lastUpdate: 0 };
    list = list.map(JSON.stringify);
    const now = new Date().getTime();

    if (JSON.stringify(sourceData.list) === JSON.stringify(list)) {
      const diff = now - db.data[source.url].lastUpdate;
      if (diff > MONTH_IN_MS) {
        messages[source.url] = {
          name: source.name ?? source.url.replace(/https?:\/\/(www\.)?/, ''),
          warning: `last update was ${dayjs.duration(-diff, 'ms').humanize(true)}`,
        };
      }
      db.data[source.url].lastCheck = now;
    } else {
      db.data[source.url] = {
        list: list,
        lastCheck: now,
        lastUpdate: now,
      };

      messages[source.url] = {
        name: source.name ?? source.url.replace(/https?:\/\/(www\.)?/, ''),
        newElements: list.filter(item => !sourceData.list.includes(item)).map(JSON.parse),
        removedElements: sourceData.list.filter(item => !list.includes(item)).map(JSON.parse),
      };
    }

  } catch (error) {
    errors.push(source.url + " : " + error);
    continue;
  } finally {
    bar.update(i + 1);
  }
}
bar.stop();

await db.write();
consoleResults(messages, errors);
openLinks(messages);
