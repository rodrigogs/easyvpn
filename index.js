const path = require('path');
const os = require('os');

const ListVpns = require('./src/api');
const Manager = require('./src/manager');

module.exports = (opts) => {
  Object.assign(opts, {
    user: 'openvpn',
    password: '',
    host: '127.0.0.1',
    port: 1337,
    timeout: 1500,
    logpath: path.join(os.tmpdir(), 'easyvpn.log'),
  });


};
