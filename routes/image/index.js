const { Router } = require("express");
const route = Router();

// route.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

route.get("/", async (req, res, next) => { res.redirect('/'); });
route.use("/spin", require("@routes/image/spin"));
// route.use("/spongebob-timecard", require("@routes/image/spongebob-timecard"));
route.use("/gru-plan", require("@routes/image/gru-plan"));
route.use("/highway-sign", require("@routes/image/highway-sign"));
route.use("/speedlimit", require("@routes/image/speedlimit"));
route.use("/two-buttons", require("@routes/image/two-buttons"));
route.use("/could-read", require("@routes/image/could-read"));
route.use("/spongebob-burn", require("@routes/image/spongebob-burn"));
route.use("/channel-topic", require("@routes/image/channel-topic"));
route.use("/car-reverse", require("@routes/image/car-reverse"));
route.use("/triggered", require("@routes/image/triggered"));

module.exports = route;
