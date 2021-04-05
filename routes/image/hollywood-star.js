const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hollywood-star.png'));
const canvas = createCanvas(base.width, base.height);
const ctx = canvas.getContext('2d');
ctx.drawImage(base, 0, 0);
ctx.font = '28px Hollywood Star';
ctx.fillStyle = '#fadfd4';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
ctx.fillText(name.toLowerCase(), 288, 140);