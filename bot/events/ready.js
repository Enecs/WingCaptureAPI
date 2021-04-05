const Event = require('@bot/base/Event.js');
const colors = require('colors');
const App = require('@structures/app.js');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'ready',
      enabled: true,
    });
  }

  async run (client) {
    await setTimeout(() => {}, 1000)
    
    client.appInfo = await client.fetchApplication();
    setInterval(async () => {
      client.appInfo = await client.fetchApplication();
    }, 60000);

    // MongoDB Connection Handler
    client.mongodb.init();

    console.log(colors.yellow(`Successfully logged into `) + colors.underline.green(client.user.tag));

    await new App(client).listen(process.env.PORT || 8080);
    console.log(colors.yellow(`Running on port `) + colors.underline.green(process.env.PORT || 8080));

    async function setActivity() {
      client.user.setActivity(`users use ${process.env.DOMAIN.replace(/http(s)?:\/\//g, '')}`, {type: "WATCHING"})
    };

    setActivity();
    setInterval(setActivity, 120000);
  }
};
