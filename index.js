'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const execa = require('execa');
const Promise = require('bluebird');
const which = require('which');
const prompt = require('prompt');

const logger = require('./src/logger');
const ListVPNs = require('./src/api');

const filePath = path.join(os.tmpdir(), 'openvpnconf');

const queryCountry = (countries) => {
  const match = countries => new RegExp(`^(?:${countries.map(country => `(${country})$`).join('|')})`);
  return new Promise((resolve, reject) => {
    logger.info(`Choose between those countries: ${countries.join(', ')}`);
    prompt.start();
    prompt.get([{
      name: 'country',
      description: 'Enter the desired country',
      message: 'Invalid country',
      required: true,
      pattern: match(countries),
    }], (err, result) => {
      if (err) return reject(err);
      resolve(result.country);
    });
  });
};

const filter = country => (vpns) => {
  if (!country) return vpns;
  return vpns
    .filter(vpn => vpn.countryNames.indexOf(country.toLowerCase()) !== -1);
};

const save = (vpns) => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath, { overwrite: true });
    writer
      .on('open', () => {
        vpns = vpns.sort((a, b) => (b.score - a.score));
        const chain = vpns.slice(0, 2).map((vpn) => {
          return new Promise(resolve => writer.write(vpn.config, resolve));
        });

        Promise.all(chain)
          .then(() => writer.close());
      })
      .on('error', reject)
      .once('close', resolve);
  });
};

const startOpenvpn = (options = []) => {
  logger.info('Starting openvpn...');
  const openvpn = `"${which.sync('openvpn')}"`;
  const proc = execa(openvpn, ['--config', `"${filePath}"`].concat(options), { shell: true });

  proc.stdout.pipe(logger.stream);
  proc.stderr.on('data', data => logger.error(data.toString()));
  proc.on('close', code => logger.info(`child process exited with code ${code}`));

  process.on('exit', () => proc.kill());
  process.on('SIGINT', () => proc.kill());

  return proc;
};

const execute = (options) => {
  logger.info('Querying data...');

  ListVPNs(options.proxy)
    .then((vpns) => {
      return new Promise((resolve, reject) => {
        if (!options.query) {
          return resolve(vpns);
        }
        const countries = Array.from(new Set(vpns.map(vpn => vpn.countryShort)));
        queryCountry(countries)
          .then((result) => {
            options.country = result;
            resolve(vpns);
          })
          .catch(reject);
      });
    })
    .then(filter(options.country))
    .then(save)
    .then(() => startOpenvpn(options.openvpn_opts))
    .catch(logger.error);
};

module.exports = options => execute(options);
