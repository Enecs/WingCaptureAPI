const path = require("path");
const express = require("express");
const cookieParser = require('cookie-parser')
const { renderTemplate, generalSecurity } = require('@structures/middleware')

class App {
  constructor(client, locals = {}) {
    this.express = express();
    this.express.set('views', './website/dynamic');
    this.express.set('view engine', 'ejs');
    this.express.set('client', client);
    this.express.use(cookieParser());
    this.express.use(generalSecurity);
    this.express.use(express.static(__dirname + "/../website/static"));
    this.express.locals = locals;

    this.express.disable('x-powered-by'); // Remove Unnessasary Header (SEO Benifits)

    this.loadRoutes().loadErrorHandler();
  }

  listen(port) {
    return new Promise((resolve) => this.express.listen(port, resolve));
  }

  loadRoutes() {
    this.express.use(require(`@routes/index.js`));
    return this;
  }


  loadErrorHandler() {
    this.express.use((error, _req, res, _next) => {
      const { message, statusCode = 500 } = error;
      if (statusCode >= 500) console.error(error);

	    let data = { message, status: statusCode };
      if(_req.accepts("html")) return renderTemplate(res, _req, "errors/express", data);
      if(_req.accepts("json")) res.status(statusCode).send({ message, status: statusCode });
      res.type("txt").send(`${statusCode} - ${message}`);
    });

    this.express.use((_req, res, _next) => {
      if(_req.accepts("html")) return renderTemplate(res, _req, "errors/404");
      if(_req.accepts("json")) return res.send({ status: 404, error: "Not found" });
      res.type("txt").send("404 - Not found");
    });

    return this;
  }
}

module.exports = App;
