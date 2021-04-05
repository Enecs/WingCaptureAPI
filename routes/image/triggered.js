const { Router } = require("express");
const Canvas = require("canvas");
const GIFEncoder = require('gifencoder');

const route = Router();

const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];

route.get("/", async (req, res, next) => {
  const imageLn = req.query.src;
  if(!imageLn) return res.end("Missing 'src' query parameter", "utf-8");

  try {
    const base = await Canvas.loadImage('https://discord.mx/1onpminKFM.png');
    const avatar = await Canvas.loadImage(imageLn);
    const encoder = new GIFEncoder(base.width, base.width);
    const canvas = Canvas.createCanvas(base.width, base.width);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, base.width, base.width);
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(50);
    encoder.setQuality(200);
    for (let i = 0; i < 4; i++) {
      drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
      ctx.drawImage(base, 0, 218, 256, 38);
      encoder.addFrame(ctx);
    }
    encoder.finish();
    const buffer = await streamToArray(stream);
    
    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(Buffer.concat(buffer), "binary");
  } catch(err) {
    console.error(err)
    res.sendStatus(404);
  }
});

function drawImageWithTint (ctx, image, color, x, y, width, height) {
  const { fillStyle, globalAlpha } = ctx;
  // ctx.fillStyle = color;
  ctx.drawImage(image, x, y, width, height);
  ctx.globalAlpha = 0.5;
  ctx.fillRect(x, y, width, height);
  // ctx.fillStyle = fillStyle;
  ctx.globalAlpha = globalAlpha;
}

function streamToArray (stream) {
  if (!stream.readable) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const array = [];
    function onData(data) {
      array.push(data);
    }
    function onEnd(error) {
      if (error) reject(error);
      else resolve(array);
      cleanup();
    }
    function onClose() {
      resolve(array);
      cleanup();
    }
    function cleanup() {
      stream.removeListener('data', onData);
      stream.removeListener('end', onEnd);
      stream.removeListener('error', onEnd);
      stream.removeListener('close', onClose);
    }
    stream.on('data', onData);
    stream.on('end', onEnd);
    stream.on('error', onEnd);
    stream.on('close', onClose);
  });
}

module.exports = route;