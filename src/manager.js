const EventEmitter = require('events');
const openvpnmanager = require('node-openvpn');
const logger = require('./logger');

/**
 * openvpn connection Manager.
 */
class Manager extends EventEmitter {

  /**
   * @param {VPN} auth openvpn server auth.
   * @param {Object} options openvpn server options.
   * @param {VPN} [vpn] VPN instance.
   */
  constructor(auth, options, vpn) {
    super();
    this.auth = auth;
    this.options = options;
    this.vpn = vpn;
    this.connection = openvpnmanager.connect(this.options);
    this.connection.on('connected', () => openvpnmanager.authorize(this.auth));
    this.connection.on('state-change', state => logger.debug(state));
    this.connection.on('error', state => logger.error(state));
    this.connection.on('disconnected', () => openvpnmanager.destroy());
  }

  /**
   * Connects to a VPN trough openvpn server.
   * @param {VPN} [vpn] VPN instance. Replaces old VPN instance.
   */
  connect(vpn) {
    this.vpn = vpn || this.vpn;
  }

  /**
   * Disconnect from the current VPN.
   */
  disconnect() {

  }

  /**
   * Destroys connection with openvpn server.
   */
  destroy() {
    this.connection.disconnect();
  }
}

module.exports = Manager;
