const path = require('path');
const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const which = require('which');
const prompt = require('prompt');

const logger = require('./src/logger');
const ListVPNs = require('./src/api');

const filePath = path.join(os.tmpdir(), 'openvpnconf');

function queryCountry(countries) {
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
}

function filter(vpns, country) {
  if (!country) return vpns;
  return vpns
    .filter(vpn => vpn.countryNames.indexOf(country.toLowerCase()) !== -1);
}

function save(vpns) {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath, { overwrite: true });
    writer
      .on('open', () => {
        vpns = vpns.sort((a, b) => (b.score - a.score));
        const chain = vpns.slice(0, 64).map((vpn) => {
          return new Promise(resolve => writer.write(vpn.config, resolve));
        });

        Promise.all(chain)
          .then(() => writer.close());
      })
      .on('error', reject)
      .once('close', resolve);
  });
}

function startOpenvpn() {
  logger.info('Starting openvpn...');
  const openvpn = `"${which.sync('openvpn')}"`;
  const proc = spawn(openvpn, [`"${filePath}"`], { shell: true });
  proc.stdout.pipe(logger.stream);
  proc.stderr.on('data', data => logger.error(data.toString()));
  proc.on('close', code => logger.info(`child process exited with code ${code}`));

  process.on('exit', () => proc.kill());
  process.on('SIGINT', () => proc.kill());
}

function execute(country, query) {
  logger.info('Querying data...');
  ListVPNs()
    .then((vpns) => {
      return new Promise((resolve, reject) => {
        if (!query) {
          return resolve(vpns);
        }
        const countries = Array.from(new Set(vpns.map(vpn => vpn.countryShort)));
        queryCountry(countries)
          .then((result) => {
            country = result;
            resolve(vpns);
          })
          .catch(reject);
      });
    })
    .then(vpns => filter(vpns, country))
    .then(save)
    .then(startOpenvpn)
    .catch(logger.error);
}

module.exports = (country, query) => execute(country, query);
