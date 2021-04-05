const { Router } = require("express");
const Canvas = require("canvas")

const route = Router();

route.get("/", async (req, res, next) => {
  let boardImgLn = 'https://discord.mx/9Z1Z59zLZ1.jpg',
   spot1Ln = 'https://discord.mx/CNwpknsvWS.jpg',
   spot2Ln = 'https://discord.mx/dPfwQH3Cp8.jpg',
   spot3Ln = 'https://discord.mx/ujHHpOIz4T.jpg',
   spot4Ln = 'https://discord.mx/Zga3hgnFRY.jpg',
   spot5Ln = 'https://discord.mx/yK9g8Tqghj.jpg',
   spot6Ln = 'https://discord.mx/XeRENheIie.jpg',
   spot7Ln = 'https://discord.mx/AkMfln40d3.jpg',
   spot8Ln = 'https://discord.mx/G5eNMys3pz.jpg',
   spot9Ln = 'https://discord.mx/qlW9jBPPvO.jpg',
   xLn = 'https://discord.mx/g6UELYFUJW.jpg',
   oLn = 'https://discord.mx/OB0YJglhDE.jpg';

  try {
    let spot1 = await Canvas.loadImage(spot1Ln),
      spot2 = await Canvas.loadImage(spot2Ln),
      spot3 = await Canvas.loadImage(spot3Ln),
      spot4 = await Canvas.loadImage(spot4Ln),
      spot5 = await Canvas.loadImage(spot5Ln),
      spot6 = await Canvas.loadImage(spot6Ln),
      spot7 = await Canvas.loadImage(spot7Ln),
      spot8 = await Canvas.loadImage(spot8Ln),
      spot9 = await Canvas.loadImage(spot9Ln),
      placeX = await Canvas.loadImage(xLn),
      placeO = await Canvas.loadImage(oLn);

    let canvas = Canvas.createCanvas(1536, 1536);
    let ctx = canvas.getContext('2d');

    let { p1, p2, p3, p4, p5, p6, p7, p8, p9 } = req.query;
    
    p1 = checkPlace(p1, spot1, placeO, placeX);
    p2 = checkPlace(p2, spot2, placeO, placeX);
    p3 = checkPlace(p3, spot3, placeO, placeX);
    p4 = checkPlace(p4, spot4, placeO, placeX);
    p5 = checkPlace(p5, spot5, placeO, placeX);
    p6 = checkPlace(p6, spot6, placeO, placeX);
    p7 = checkPlace(p7, spot7, placeO, placeX);
    p8 = checkPlace(p8, spot8, placeO, placeX);
    p9 = checkPlace(p9, spot9, placeO, placeX);

    ctx.drawImage(p1, 512*0, 512*0);
    ctx.drawImage(p2, 512*1, 512*0);
    ctx.drawImage(p3, 512*2, 512*0);
    ctx.drawImage(p4, 512*0, 512*1);
    ctx.drawImage(p5, 512*1, 512*1);
    ctx.drawImage(p6, 512*2, 512*1);
    ctx.drawImage(p7, 512*0, 512*2);
    ctx.drawImage(p8, 512*1, 512*2);
    ctx.drawImage(p9, 512*2, 512*2);

    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(await canvas.toBuffer(), "binary");

  } catch(err) {
    console.error(err)
    res.sendStatus(404);
  }
});

function checkPlace(val, placenum, imgO, imgX) {
  if(String(val).toLowerCase() == 'o') return imgO;
  if(String(val).toLowerCase() == 'x') return imgX;
  return placenum;
}

function abbreviateNumber(value) {
  if(isNaN(value)) return value;
  var digit = 1;
  var symbols = ["", "K", "M", "G", "T", "P", "E"];
  var newValue = Number(value);
  const sign = Math.sign(newValue) >= 0;
  newValue = Math.abs(newValue);
  const tier = (Math.log10(newValue) / 3) | 0;
  if (tier == 0) return value.toString();
  const suffix = symbols[tier];
  if (!suffix) throw new RangeError();
  const scale = Math.pow(10, tier * 3);
  const scaled = newValue / scale;
  return (!sign ? "-" : "") + scaled.toFixed(digit) + suffix;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

module.exports = route;