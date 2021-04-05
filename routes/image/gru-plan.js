const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

Canvas.registerFont('./fonts/Noto-Regular.ttf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-CJK.otf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-Emoji.ttf', { family: 'Noto' });
const coord = [[450, 129], [1200, 134], [450, 627], [1200, 627]];

route.get("/", async (req, res, next) => {
  const step1 = req.query.step1, step2 = req.query.step2, step3 = req.query.step3;
  if(!step1) return res.end("Missing 'step1' query parameter", "utf-8");
  if(!step2) return res.end("Missing 'step2' query parameter", "utf-8");
  if(!step3) return res.end("Missing 'step3' query parameter", "utf-8");
  
  try {
    const steps = [step1, step2, step3, step3];
		const base = await Canvas.loadImage('https://discord.mx/ZSyfgwg6Ya.png');
		const canvas = Canvas.createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		let i = 0;
		for (const [x, y] of coord) {
			ctx.font = '35px Noto';
			const step = steps[i];
			let fontSize = 35;
			while (ctx.measureText(step).width > 1100) {
				fontSize--;
				ctx.font = `${fontSize}px Noto`;
			}
			const lines = await wrapText(ctx, step, 252);
			ctx.fillText(lines.join('\n'), x, y);
			i++;
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