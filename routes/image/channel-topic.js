const { Router } = require("express");
const Canvas = require("canvas");

const route = Router();

Canvas.registerFont('./fonts/Noto-Regular.ttf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-CJK.otf', { family: 'Noto' });
Canvas.registerFont('./fonts/Noto-Emoji.ttf', { family: 'Noto' });

route.get("/", async (req, res, next) => {
  const name = req.query.name, topic = req.query.topic;
  if(!name) return res.end("Missing 'name' query parameter", "utf-8");
  if(!topic) return res.end("Missing 'topic' query parameter", "utf-8");

  try {
    const channelIcon = await Canvas.loadImage('https://discord.mx/BPNL4HcOdX.png');
    const canvas = Canvas.createCanvas(1248, 50);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#36393F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(channelIcon, 20, 11);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Whitney'
    ctx.fillText(name.slice(0, 100).toLowerCase(), 50, 28)

    ctx.fillStyle = '#41444A';
    ctx.fillRect(50+ctx.measureText(name.slice(0, 100)).width+16, 13, 1, 24)

    ctx.fillStyle = '#989A9E';
    ctx.font = '16px Arial'
    ctx.fillText(topic, 50+ctx.measureText(name.slice(0, 100)).width+16+25, 28, 1200)

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