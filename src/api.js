'use strict';

const url = require('url');
const request = require('request');
const csv = require('csvtojson');
const through2 = require('through2');
const Promise = require('bluebird');
const Agent = require('socks5-http-client/lib/Agent');
const VPN = require('./vpn');

const VPNGATE_API_URL = 'http://www.vpngate.net/api/iphone/';
const DEFAULT_ENCODE = 'utf8';

function networkError(err) {
  return `API request failed with code: ${err.statusCode || err.code}
Error message: ${err.message}`;
}

function filter(chunk, enc, cb) {
  const createBuffer = data => new Buffer(data, DEFAULT_ENCODE);
  const lines = chunk.toString()
    .split('\r\n')
    .filter(line => (line !== '*vpn_servers' && line !== '*'))
    .map((line) => {
      if (line.startsWith('#HostName')) {
        return line.replace('#HostName', 'HostName');
      }
      return line;
    })
    .join('\r\n');

  this.push(createBuffer(lines));
  cb();
}

function resolveProxy(proxy, options) {
  try {
    proxy = url.parse(proxy);
  } catch (ex) {
    throw new Error('Invalid proxy url');
  }
  if (proxy.protocol.startsWith('socks')) {
    const authParts = (proxy.auth || '')
      .split(':')
      .filter(part => part.length);
    const auth = {
      username: authParts[0],
      password: authParts[1],
    };
    options.agentClass = Agent;
    options.agentOptions = {
      socksHost: proxy.hostname,
      socksPort: proxy.port,
      socksUsername: auth.username,
      socksPassword: auth.password,
    };
    return;
  }
  options.proxy = proxy.href;
}

function getData(proxy) {
  return new Promise((resolve, reject) => {
    const options = { url: VPNGATE_API_URL };
    if (proxy) resolveProxy(proxy, options);

    request(options)
      .on('response', (response) => {
        if (response.statusCode !== 200) reject(new Error(`Request failed with code ${response.statusCode}`));
      })
      .on('error', err => reject(networkError(err)))
      .pipe(through2(filter))
      .pipe(csv())
      .on('error', reject)
      .on('end_parsed', resolve);
  });
}

module.exports = proxy => getData(proxy)
  .then(list => Promise.resolve(list.map(vpn => new VPN(vpn))));
