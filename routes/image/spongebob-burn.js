const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

Canvas.registerFont('./fonts/Noto-Regular.ttf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-CJK.otf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-Emoji.ttf', { family: 'Noto' });

route.get("/", async (req, res, next) => {
  const text = req.query.text;
  if(!text) return res.end("Missing 'text' query parameter", "utf-8");
  try {
    const base = await Canvas.loadImage('https://discord.mx/HVJ7TNbi8a.png');
		const canvas = Canvas.createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		ctx.font = '35px Noto';
		let fontSize = 35;
		while (ctx.measureText(text).width > 400) {
			fontSize--;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, text, 180);
		ctx.fillText(lines.join('\n'), 55, 103);

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