const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

Canvas.registerFont('./fonts/Noto-Regular.ttf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-CJK.otf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-Emoji.ttf', { family: 'Noto' });
const coord = [[450, 129], [1200, 134], [450, 627], [1200, 627]];

route.get("/", async (req, res, next) => {
  const first = req.query.first, second = req.query.second;
  if(!first) return res.end("Missing 'first' query parameter", "utf-8");
  if(!second) return res.end("Missing 'second' query parameter", "utf-8");
  
  try {
    const base = await Canvas.loadImage('https://discord.mx/cd9KraJTIg.png');
		const canvas = Canvas.createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.textBaseline = 'top';
		ctx.drawImage(base, 0, 0);
		ctx.rotate(-12 * (Math.PI / 180));
		ctx.font = '34px Noto';
		let fontSize = 34;
		while (ctx.measureText(first).width > 366) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const firstLines = await wrapText(ctx, first, 183);
		let lineOffset = 0;
		for (let i = 0; i < firstLines.length; i++) {
			ctx.fillText(firstLines[i], 25 + lineOffset, 116 + (fontSize * i) + (10 * i), 183);
			lineOffset += 5;
		}
		ctx.font = '34px Noto';
		fontSize = 34;
		while (ctx.measureText(second).width > 244) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const secondLines = await wrapText(ctx, second, 118);
		lineOffset = 0;
		for (let i = 0; i < secondLines.length; i++) {
			ctx.fillText(secondLines[i], 254 + lineOffset, 130 + (fontSize * i) + (10 * i), 118);
			lineOffset += 5;
		}
		ctx.rotate(12 * (Math.PI / 180));

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