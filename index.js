const path = require('path');
const os = require('os');
const fs = require('fs');
const spawn = require('child_process').spawn;
const Promise = require('bluebird');
const which = require('which');

const logger = require('./src/logger');
const ListVPNs = require('./src/api');

const filePath = path.join(os.tmpdir(), 'openvpnconf');

function filter(vpns, country) {
  if (!country) return vpns;
  return vpns
    .filter(vpn => [vpn.countryLong, vpn.countryShort].indexOf(country) !== -1);
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
  const openvpn = which.sync('openvpn');
  const proc = spawn(openvpn, [filePath], { shell: true });
  proc.stdout.pipe(logger.stream);
  proc.stderr.on('data', data => logger.error(data.toString()));
  proc.on('close', code => logger.info(`child process exited with code ${code}`));

  process.on('exit', () => proc.kill());
  process.on('SIGINT', () => proc.kill());
}

function execute(country) {
  ListVPNs()
    .then(vpns => filter(vpns, country))
    .then(save)
    .then(startOpenvpn)
    .catch(logger.error);
}

module.exports = country => execute(country);
