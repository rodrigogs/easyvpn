# easyvpn

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

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License
[Licence](https://github.com/rodrigogs/easyvpn/blob/master/LICENSE) © Rodrigo Gomes da Silva
