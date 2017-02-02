#!/usr/bin/env node

'use strict';

function findArgValue(args, names) {
  let found = null;
  args.forEach((arg, index) => {
    if (names.indexOf(arg) > -1) {
      found = args[index + 1];
    }
  });
  return found;
}

function hasArg(args, names) {
  return !!args.find(arg => (names.indexOf(arg) > -1));
}

const args = process.argv.slice(2);
const options = {};
options.country = findArgValue(args, ['-c', '--country']);
options.query = hasArg(args, ['-q', '--query']);
options.proxy = findArgValue(args, ['-p', '--proxy']);

require('../index.js')(options);
