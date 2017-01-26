#!/usr/bin/env node

function findArg(args, names) {
  let found = null;
  args.forEach((arg, index) => {
    if (names.indexOf(arg) > -1) {
      found = args[index + 1];
    }
  });
  return found;
}

const args = process.argv.slice(2);
const country = findArg(args, ['-c', '--country']);

require('../index.js')(country);
