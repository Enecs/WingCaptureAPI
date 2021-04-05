const { Router } = require("express");
const { renderTemplate } = require("@structures/middleware");

const route = Router();

route.use("/", require("@routes/auth"));
route.use("/games", require("@routes/games"));
route.use("/image", require("@routes/image"));

route.get('/', async (req, res) => {
  renderTemplate(res, req, 'index');
});

route.get('/documentation', async (req, res) => {
  renderTemplate(res, req, 'documentation');
});

route.get("/terms", async (req, res, next) => {
  renderTemplate(res, req, "pages/terms");
});
route.get("/privacy", async (req, res, next) => {
  renderTemplate(res, req, "pages/privacy");
});

module.exports = route;
