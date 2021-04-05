const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

const cards = {
  "0": "https://discord.mx/sqkgzx5k9z.png",
  "1": "https://discord.mx/CqzW9YAm70.png",
  "2": "https://discord.mx/DicIvN1c3H.png",
  "3": "https://discord.mx/d97hlr9jyV.png",
  "4": "https://discord.mx/dDxhtzuth9.png",
  "5": "https://discord.mx/GTQQ7awwHu.png",
  "6": "https://discord.mx/O6y7cS2kmY.png",
  "7": "https://discord.mx/p5ApSBvs8N.png",
  "8": "https://discord.mx/cgpZ1Wf2AN.png",
  "9": "https://discord.mx/tm1thIidEG.png",
  "10": "https://discord.mx/alt5000hC4.png",
  "11": "https://discord.mx/obMFoEWEuL.png",
  "12": "https://discord.mx/xtaWeIOZoH.png",
  "13": "https://discord.mx/3qUOHogaoY.png",
  "14": "https://discord.mx/ZlXPkJaX19.png",
  "15": "https://discord.mx/IKR0XEBTv4.png",
  "16": "https://discord.mx/iSUi4P1KVg.png",
  "17": "https://discord.mx/wdw7PKKjAr.png",
  "18": "https://discord.mx/2iPO3nkJDL.png",
  "19": "https://discord.mx/5zRSIMhz6U.png",
  "20": "https://discord.mx/FUtnXdwR5C.png",
  "21": "https://discord.mx/ybiNpZgFt3.png",
  "22": "https://discord.mx/kJGUWGLkLk.png",
}

Canvas.registerFont('./fonts/Spongeboytt1.ttf', { family: 'Spongeboytt1' });

route.get("/", async (req, res, next) => {
  const text = req.query.text || req.query.txt;
  if(!text) return res.end("Missing 'text' query parameter", "utf-8");
  try {
    const canvas = Canvas.createCanvas(1920, 1080);
		const ctx = canvas.getContext('2d');
		const num = Math.floor(Math.random() * 23);
		const base = await Canvas.loadImage(cards[String(num)]);
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '115px Spongeboytt1';
		const lines = await wrapText(ctx, text.toUpperCase(), 1800);
		const topMost = (canvas.height / 2) - (((115 * lines.length) / 2) + ((60 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((115 + 60) * i);
			ctx.fillStyle = '#ecbd3b';
			ctx.fillText(lines[i], (canvas.width / 2) + 6, height + 6);
			ctx.fillStyle = 'black';
			ctx.fillText(lines[i], canvas.width / 2, height);
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