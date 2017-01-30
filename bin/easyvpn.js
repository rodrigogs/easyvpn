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
const country = findArgValue(args, ['-c', '--country']);
const queryCountry = hasArg(args, ['-q', '--query']);

require('../index.js')(country, queryCountry);
