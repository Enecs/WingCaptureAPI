require('dotenv').config();
require("module-alias/register");
require('@structures/wingcapture.js')()

const VoidClient = require('@bot/base/BotClass.js');
const client = new VoidClient({
  allowedMentions: {
    parse: [ "users", "roles" ]
  },
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
  restTimeOffset: 90,
  ws: {
    large_threshold: 1000,
  },
});

client.login(process.env.DISCORD_TOKEN).catch(err => console.log(err));