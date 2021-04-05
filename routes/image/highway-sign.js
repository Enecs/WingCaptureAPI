const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

Canvas.registerFont('./fonts/Noto-Regular.ttf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-CJK.otf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-Emoji.ttf', { family: 'Noto' });
const coord = [[450, 129], [1200, 134], [450, 627], [1200, 627]];

route.get("/", async (req, res, next) => {
  const text = req.query.text;
  if(!text) return res.end("Missing 'text' query parameter", "utf-8");
  
  try {
    const base = await Canvas.loadImage('https://discord.mx/NOmCqcJAlX.png');
		const canvas = Canvas.createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = '#efe390';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '18px Electronic Highway Sign';
		const lines = await wrapText(ctx, text.toUpperCase(), 178);
		if (lines.length === 1) {
			ctx.fillText(lines[0], 318, 109);
		} else if (lines.length === 2) {
			ctx.fillText(lines[0], 318, 109);
			ctx.fillText(lines[1], 318, 128);
		} else if (lines.length === 3) {
			ctx.fillText(lines[0], 318, 90);
			ctx.fillText(lines[1], 318, 109);
			ctx.fillText(lines[2], 318, 128);
		} else {
			ctx.fillText(lines[0], 318, 90);
			ctx.fillText(lines[1], 318, 109);
			ctx.fillText(lines[2], 318, 128);
			ctx.fillText(lines[3], 318, 147);
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

function wrapText(ctx, text, maxWidth) {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) {
          words[1] = `${temp.slice(-1)}${words[1]}`;
        } else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports = route;