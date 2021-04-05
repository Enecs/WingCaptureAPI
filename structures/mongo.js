const mongoose = require("mongoose");
const colors = require('colors');

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };
    mongoose.connect(process.env.MONGODB_URI, dbOptions);
    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log(colors.green("[MongoDB READY]"), "Successfully established a connection.");
    });

    mongoose.connection.on("err", (err) => {
      console.error(colors.red("[MongoDB ISSUE]"), `Connection error: \n${err.stack}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(colors.red("[MongoDB ISSUE]"), `Connection lost`);
    });
  }
};
