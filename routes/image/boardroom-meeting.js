const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

route.get("/", async (req, res, next) => {
  const imageLn = req.query.src;
  if(!imageLn) return res.end("Missing 'src' query parameter", "utf-8");

  try {
    let baseImage = await Canvas.loadImage('https://discord.mx/Pl21eGxw7R.png');
    let image = await Canvas.loadImage(imageLn);

    let canvas = Canvas.createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext('2d');

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 322, 0, 312, 312);

    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(await canvas.toBuffer(), "binary");
  } catch(err) {
    console.error(err)
    res.sendStatus(404);
  }
});

module.exports = route;