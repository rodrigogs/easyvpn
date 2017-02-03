# easyvpn

[![Code Climate](https://codeclimate.com/github/rodrigogs/easyvpn/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/easyvpn)
[![dependencies Status](https://david-dm.org/rodrigogs/easyvpn/status.svg)](https://david-dm.org/rodrigogs/easyvpn)
[![devDependency Status](https://david-dm.org/rodrigogs/easyvpn/dev-status.svg)](https://david-dm.org/rodrigogs/easyvpn#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/easyvpn.svg)](https://www.npmjs.com/package/easyvpn)
[![npm version](https://badge.fury.io/js/easyvpn.svg)](https://badge.fury.io/js/easyvpn)

This project was inspired by [autovpn](https://github.com/adtac/autovpn). Automatically connect you to a random VPN in a country of your choice. It uses openvpn to connect you to a server obtained from [VPN Gate](http://www.vpngate.net/en/).

Differently from autovpn, this tool is able to run on Windows. Instead of executing `sudo` directly from the code, this tool leaves the task up to the user, so it is suposed to work on any platform. 
 
## Requirements
> [openvpn](https://openvpn.net/index.php/open-source/downloads.html) must be installed and set in the environment.

> your cmd/powershell/shell etc... must have user elevation.

## Install
> npm install easyvpn -g

## Usage
To connect to any received vpn connection:
> easyvpn

To connect to a VPN from a specific country:
> easyvpn -c US

Country name may be short or long:
> easyvpn -c Japan

> easyvpn -c JP

You can even wait for easyvpn to resolve the countries and then choose between them:
> easyvpn -q

A proxy can be used to get data from vpngate.net:
> easyvpn -p http://myproxy:3128

To pass special arguments to openvpn:
> easyvpn -o "--dev-type tun --dev tun0"

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Disclaimer
Regarding the security concerns, this tool is not even close to be safe to use. VPN connections are dangerous and may expose you to threats.
I'd never recommend to use this tool inside a network that can't be compromised.

## License
[Licence](https://github.com/rodrigogs/easyvpn/blob/master/LICENSE) © Rodrigo Gomes da Silva
