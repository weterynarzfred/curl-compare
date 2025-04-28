import { JSDOM } from 'jsdom';
import { JSONFilePreset } from 'lowdb/node';
import _ from "lodash";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import cliProgress from 'cli-progress';

import sources from './sources.mjs';
import consoleResults from './src/consoleResults.mjs';
import openLinks from './src/openLinks.mjs';
import { loadHandlers } from './handlers/_index.mjs';

function simplifyUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '');
}

dayjs.extend(duration);
dayjs.extend(relativeTime);

const db = await JSONFilePreset('db.json', {});
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`${BOLD}\n# Checking${RESET}`);

const progressBar = new cliProgress.SingleBar({
  format: '[{bar}] {value}/{total}',
  barsize: 80,
  hideCursor: true,
}, cliProgress.Presets.shades_classic);

const handlers = await loadHandlers();
const messages = {};
const errors = [];

progressBar.start(sources.length, 0);

for (const [index, source] of sources.entries()) {
  try {
    const handler = handlers[source.type];
    if (!handler) throw new Error(`Unknown source type: ${source.type}`);

    const dom = await JSDOM.fromURL(source.url);
    const extractedList = handler(dom, source).map(JSON.stringify);

    const now = Date.now();
    const storedData = db.data[source.url] ?? { list: [], lastCheck: 0, lastUpdate: 0 };
    const oldList = storedData.list;

    if (_.isEqual(oldList, extractedList)) {
      const timeSinceUpdate = now - storedData.lastUpdate;
      if (timeSinceUpdate > MONTH_IN_MS) {
        messages[source.url] = {
          name: source.name ?? simplifyUrl(source.url),
          warning: `Last update was ${dayjs.duration(-timeSinceUpdate, 'ms').humanize(true)}`,
        };
      }
      storedData.lastCheck = now;
    } else {
      db.data[source.url] = {
        list: extractedList,
        lastCheck: now,
        lastUpdate: now,
      };

      messages[source.url] = {
        name: source.name ?? simplifyUrl(source.url),
        newElements: extractedList.filter(item => !oldList.includes(item)).map(JSON.parse),
        removedElements: oldList.filter(item => !extractedList.includes(item)).map(JSON.parse),
      };
    }
  } catch (error) {
    errors.push(`${source.url} : ${error.message || error}`);
  } finally {
    progressBar.update(index + 1);
  }
}

progressBar.stop();
await db.write();

consoleResults(messages, errors);
openLinks(messages);
