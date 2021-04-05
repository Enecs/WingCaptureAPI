const { Router } = require("express");
const Canvas = require("canvas")

const route = Router();

route.get("/", async (req, res, next) => {
  let boardImgLn = 'https://discord.mx/lgjsESCPxD.png',
   yelloWinLn = 'https://discord.mx/wAoddOA2kb.png',
   redWinLn = 'https://discord.mx/oRMQ37BV47.png',
   redCircleLn = 'https://discord.mx/kVxB4Ud3RA.png',
   yellowCircleLn = 'https://discord.mx/AxxkxZvxai.png',
   whiteCircleLn = 'https://discord.mx/Q101ljj9sm.png';

  try {
    let boardImg = await Canvas.loadImage(boardImgLn),
      yelloWin = await Canvas.loadImage(yelloWinLn),
      redWin = await Canvas.loadImage(redWinLn),
      redCircle = await Canvas.loadImage(redCircleLn),
      yellowCircle = await Canvas.loadImage(yellowCircleLn),
      whiteCircle = await Canvas.loadImage(whiteCircleLn);

    let canvas = Canvas.createCanvas(boardImg.width, boardImg.height);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(boardImg, 0, 0, boardImg.width, boardImg.height);

    let { row1, row2, row3, row4, row5, row6 } = req.query;
    
    const board = [
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"], 
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"], 
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"], 
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"], 
      ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"]
    ];
    
    const columnx = { "0": 10, "1": 110, "2": 210, "3": 310, "4": 410, "5": 510, "6": 610, },
      fila = { "0": 10, "1": 110, "2": 210, "3": 310, "4": 410, "5": 510 },
      filaR = { "0": 510, "1": 410, "2": 310, "3": 210, "4": 110, "5": 10 }

    let y = 0;
    for (const i of board) {
      let x = 0;
      for (const j of i) {
        ctx.drawImage(whiteCircle, columnx[x] + 10, fila[y] + 10, 50, 50)
        x++
      }
      y++
    }


    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(await canvas.toBuffer(), "binary");

  } catch(err) {
    console.error(err)
    res.sendStatus(404);
  }
});

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