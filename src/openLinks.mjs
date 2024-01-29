import { spawn } from 'node:child_process';

export default function openLinks(messages) {
  for (const sourceKey in messages) {
    const message = messages[sourceKey];
    if (message.newElements?.length === 0) continue;

    for (const element of message.newElements) {
      if (element.url === undefined) continue;

      spawn('C:/Program Files/Waterfox/waterfox', [element.url]);
    }
  }
}
