import { spawn } from 'node:child_process';

export default function openLinks(messages) {
  let openCount = 0;
  for (const sourceKey in messages) {
    const message = messages[sourceKey];
    if (
      message.newElements === undefined ||
      message.newElements.length === 0
    ) continue;

    for (const element of message.newElements) {
      if (element.url === undefined) continue;

      setTimeout(() => {
        spawn('C:/Program Files/Waterfox/waterfox', [element.url]);
      }, openCount * 500);
      openCount++;
    }
  }
}
