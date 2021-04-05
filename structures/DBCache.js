// const Bots = require("@models/bots");

module.exports = class DBCache {
  constructor() {
    this.bots = {};

    setInterval(() => this.cacheBots(), 300000)
    this.cacheBots();
  }

  async cacheBots() {
    // this.bots = await Bots.find({}, { _id: false });
    return true;
  }
}