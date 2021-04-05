const { Router } = require("express");
const route = Router();

route.get("/", async (req,res,next) => { res.redirect('/'); });
route.use("/connectfour", require("@routes/games/connectfour"));
route.use("/tictactoe", require("@routes/games/tictactoe"));

module.exports = route;
