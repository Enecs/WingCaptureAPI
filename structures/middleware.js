const path = require('path');
const templateDir = path.resolve(`${process.cwd()}${path.sep}website${path.sep}dynamic`);
const { getUser } = require("@structures/discordApi");
const fs = require('fs');

function abbreviateNumber(value, commas = true) {
  if(isNaN(value)) return value;
  if(commas == true) return Number(value).toLocaleString();

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

module.exports.renderTemplate = async (res, req, template, data = {}) => {
  if(!res.render) return console.error('TypeError: res was not defined');
  if(!req.cookies) return console.error('TypeError: req was not defined');

  const baseData = {
    botclient: req.client,
    path: req.path,
    user: req.user,
    abbreviateNumber: abbreviateNumber,
  };
  res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

module.exports.requiredLogin = async (req, res, next) => {
  if(!req.user) {
    res.cookie("backURL", encodeURIComponent(req.originalUrl));
    return module.exports.renderTemplate(res, req, "errors/403")
  }
  next();
};

module.exports.generalSecurity = async (req, res, next) => {
  if(req.headers.host == "www."+process.env.DOMAIN.toString().replace(/(http(s?)):\/\//i, '')) return res.redirect(process.env.DOMAIN+req.url);

  // Access Log
  let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddres;
  let userAgent = req.headers['user-agent'];
  let date = `[${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}:${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} -0000]`
  let info = `${req.method} ${req.url} HTTP/${req.httpVersion}`
  fs.appendFile(`accesslogs/${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}.log`, `\n${ipAddr} - ${userAgent} - ${date} "${info}"`, function (err) {
    if (err) return console.log(err);
  });
  // End of Access Log

  // DDoS Prevention System
  req.app.get('client').requests += 1;

  // User Variable On All Pages
  let user = null;
  let {vb_key} = req.cookies;
  if (vb_key) {
    let access_token = vb_key.split('.')[1], refresh_token = vb_key.split('.')[0];
    let result = await getUser({access_token, refresh_token});
    if (!result) return res.redirect("/login");
    [user, {refresh_token, access_token}] = result;
    res.cookie("accesskey", `${refresh_token}.${access_token}`, {httpOnly: true});

    user.isAdmin = process.env.ADMIN_USERS.split(' ').includes(user.id);
    if(!req.app.get('client').users.cache.get(user.id)) await req.app.get('client').users.fetch(user.id);
    const userMember = req.app.get('client').guilds.cache.get(process.env.GUILD_ID).member(user.id);
    user.isStaff = userMember ? userMember.roles.cache.has(process.env.STAFF_ROLE) : false;
    user.user = userMember ? userMember.user : null;

    user.avatarURL = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.includes('a_') ? 'gif' : 'png'}` : 'https://cdn.discordapp.com/embed/avatars/0.png';
  }

  req.client = req.app.get('client');
  req.user = user;
  next();
}