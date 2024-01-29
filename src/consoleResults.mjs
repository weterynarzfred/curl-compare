export default function consoleResults(messages, errors) {
  if (Object.values(messages).length === 0) {
    console.log('\x1b[1m%s\x1b[0m', "\n# nothing new found");
  } else {
    const lineLength = 120;
    const horizontalLine = ('').padEnd(lineLength, '─');

    for (const sourceKey in messages) {
      const message = messages[sourceKey];

      console.log('\x1b[1m%s\x1b[0m', `\n┌${horizontalLine}┐\n│ ${message.name.slice(0, lineLength - 2).padEnd(lineLength - 1)}│`);

      if (message.warning !== undefined) {
        console.log('%s\x1b[31m%s\x1b[0m%s', '│ ', message.warning.padEnd(lineLength - 1), '│');
      }

      if (message.newElements?.length) {
        console.log('%s\x1b[1m\x1b[32m%s\x1b[0m%s', `├${horizontalLine}┤\n│`, (' # new:').padEnd(lineLength), '│');
        for (const element of message.newElements) {
          console.log('%s\x1b[36m%s\x1b[0m%s', '│ - ', element.name.slice(0, lineLength - 3).padEnd(lineLength - 3), '│');
          for (const key in element) {
            if (key === 'name') continue;
            console.log('%s\x1b[90m%s%s', '│', (`   ${key}: \x1b[0m${element[key]}`).padEnd(lineLength + 4), '│');
          }
        }
      }

      if (message.removedElements?.length) {
        console.log('%s\x1b[1m\x1b[31m%s\x1b[0m%s', `├${horizontalLine}┤\n│`, (' # removed:').padEnd(lineLength), '│');
        for (const element of message.removedElements) {
          console.log('%s\x1b[36m%s\x1b[0m%s', '│ - ', element.name.slice(0, lineLength - 3).padEnd(lineLength - 3), '│');
          for (const key in element) {
            if (key === 'name') continue;
            console.log('%s\x1b[90m%s%s', '│', (`   ${key}: \x1b[0m${element[key]}`).padEnd(lineLength + 4), '│');
          }
        }
      }

      console.log(`└${horizontalLine}┘`);
    }
  }

  if (errors.length > 0) {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', "\n# errors:");
    console.log(errors);
  }
}
