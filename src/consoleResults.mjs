const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

const lineLength = 120;
const horizontalLine = '─'.repeat(lineLength);

function logBoxHeader(title) {
  console.log(`${BOLD}\n┌${horizontalLine}┐`);
  console.log(`│ ${title.slice(0, lineLength - 2).padEnd(lineLength - 1)}│${RESET}`);
}

function logBoxSection(label, colorCode) {
  console.log(`├${horizontalLine}┤`);
  console.log(`│${BOLD}${colorCode}${label.padEnd(lineLength)}${RESET}│`);
}

function logElement(element) {
  console.log(`│ - ${CYAN}${element.name.slice(0, lineLength - 3).padEnd(lineLength - 3)}${RESET}│`);
  for (const key in element) {
    if (key === 'name') continue;
    console.log(`│${GRAY}   ${key}: ${RESET}${element[key].padEnd(lineLength - 8)}│`);
  }
}

export default function consoleResults(messages, errors) {
  if (Object.values(messages).length === 0) {
    console.log(`${BOLD}\n# nothing new found${RESET}`);
    return;
  }

  for (const sourceKey in messages) {
    const message = messages[sourceKey];

    logBoxHeader(message.name);

    if (message.warning) {
      console.log(`│ ${RED}${message.warning.padEnd(lineLength - 1)}${RESET}│`);
    }

    if (message.newElements?.length) {
      logBoxSection(' # new:', GREEN);
      for (const element of message.newElements) {
        logElement(element);
      }
    }

    if (message.removedElements?.length) {
      logBoxSection(' # removed:', RED);
      for (const element of message.removedElements) {
        logElement(element);
      }
    }

    console.log(`└${horizontalLine}┘`);
  }

  if (errors.length > 0) {
    console.log(`\n${BOLD}${RED}# errors:${RESET}`);
    console.log(errors);
  }
}
