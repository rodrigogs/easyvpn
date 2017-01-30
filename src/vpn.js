'use strict';

class VPN {
  constructor(opts) {
    this.host = opts.HostName;
    this.ip = opts.IP;
    this.score = opts.Score;
    this.ping = opts.Ping;
    this.countryLong = opts.CountryLong;
    this.countryShort = opts.CountryShort;
    this.numVpnSessions = opts.NumVpnSessions;
    this.uptime = opts.Uptime;
    this.totalUsers = opts.TotalUsers;
    this.totalTraffic = opts.TotalTraffic;
    this.logType = opts.LogType;
    this.operator = opts.Operator;
    this.message = opts.Message;
    this.openVPN_ConfigData_Base64 = opts.OpenVPN_ConfigData_Base64;
  }

  get countryNames() {
    const names = [];
    if (this.countryShort) names.push(this.countryShort.toLowerCase());
    if (this.countryLong) names.push(this.countryLong.toLowerCase());
    return names;
  }

  get config() {
    if (!this.openVPN_ConfigData_Base64) {
      return null;
    }
    return Buffer.from(this.openVPN_ConfigData_Base64, 'base64');
  }
}

module.exports = VPN;
