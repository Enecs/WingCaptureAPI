const { Router } = require("express");
const Canvas = require("canvas")
const GIF = require("gif-encoder");

const route = Router();

route.get("/", async (req, res, next) => {
  const algo = req.query.src;
  if(!algo) return res.end("Missing 'src' query parameter", "utf-8");
  try {
    const DEGREES = 20;
    const SIZE = 256;
    const FPS = 16;
    const image = await Canvas.loadImage(algo);
    const canvas = Canvas.createCanvas(SIZE, SIZE);
    const context = canvas.getContext("2d");
    const tempCanvas = Canvas.createCanvas(SIZE, SIZE);
    const tempcontext = tempCanvas.getContext("2d");
    canvas.width = canvas.height = tempCanvas.width = tempCanvas.height = SIZE;
    const gif = new GIF(SIZE, SIZE);
    gif.setQuality(50);
    gif.setRepeat(0);
    gif.setDelay(1000 / FPS);
    gif.setTransparent()
    const chunks = [];
    gif.on("data", b => {
      chunks.push(b);
    });
    gif.on("end", async () => {
      const pre_buf = Buffer.concat(chunks);
      res.writeHead(200, {
        "Content-Type": "image/gif"
      });
      res.end(pre_buf, "binary");
    });
    for (let i = 0; i < parseInt(360 / DEGREES); i++) {
      tempcontext.save();
      tempcontext.clearRect(0, 0, canvas.width, canvas.height);
      tempcontext.beginPath();
      tempcontext.arc(
        canvas.width / 2,
        canvas.height / 2,
        SIZE / 2,
        0,
        2 * Math.PI
      );
      tempcontext.closePath();
      tempcontext.clip();
      if (i != 0) {
        tempcontext.translate(SIZE / 2, SIZE / 2);
        tempcontext.rotate((DEGREES * i * Math.PI) / 180);
        tempcontext.translate(-(SIZE / 2), -(SIZE / 2));
      } else gif.writeHeader();
      tempcontext.drawImage(image, 0, 0);
      const imgData = tempcontext.getImageData(0, 0, canvas.width, canvas.height);
      optimizeFrameColors(imgData.data);
      tempcontext.putImageData(imgData, 0, 0);
      context.drawImage(tempCanvas, 0, 0);
      gif.addFrame(context.getImageData(0, 0, canvas.width, canvas.height).data);
      tempcontext.restore();
    }
    gif.finish();
  } catch(err) {
    console.error(err)
    res.sendStatus(404);
  }
});

function optimizeFrameColors(data) {
  for (let i = 0; i < data.length; i += 4) {
    // clamp greens to avoid pure greens from turning transparent
    data[i + 1] = data[i + 1] > 250 ? 250 : data[i + 1];
    // clamp transparency
    data[i + 3] = data[i + 3] > 127 ? 255 : 0;
  }
}

module.exports = route;