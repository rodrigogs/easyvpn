class VPN {
  constructor(otps) {
    this.host = otps.HostName;
    this.ip = otps.IP;
    this.score = otps.Score;
    this.ping = otps.Ping;
    this.countryLong = otps.CountryLong;
    this.countryShort = otps.CountryShort;
    this.numVpnSessions = otps.NumVpnSessions;
    this.uptime = otps.Uptime;
    this.totalUsers = otps.TotalUsers;
    this.totalTraffic = otps.TotalTraffic;
    this.logType = otps.LogType;
    this.operator = otps.Operator;
    this.message = otps.Message;
    this.openVPN_ConfigData_Base64 = otps.OpenVPN_ConfigData_Base64;
  }
}

module.exports = VPN;
