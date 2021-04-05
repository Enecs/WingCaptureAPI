const { Router } = require("express");

const { getUser, addUser } = require('@structures/discordApi.js');
// const Users = require('@models/users')

const route = Router();

route.get("/login", async (req, res, next) => {
  if (req.query.server) res.cookie("joinServer", `true`);
  if(req.cookies.backURL && (decodeURIComponent(req.cookies.backURL) == '/login')) res.clearCookie("backURL");
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&scope=identify%20guilds.join&prompt=none&redirect_uri=${encodeURIComponent(process.env.DOMAIN)}/callback`);
});

route.get("/callback", async (req, res, next) => {
  if(req.cookies.backURL && (decodeURIComponent(req.cookies.backURL) == '/login')) res.clearCookie("backURL");
  if (!req.query.code) return res.redirect('/?e=no_code_provided');
  const code = req.query.code;
  const result = await getUser({code});
  if (!result) return res.redirect('/login?e=not_found');
  const [user, {refresh_token, access_token}] = result;

  res.cookie("accesskey", `${refresh_token}.${access_token}`, {httpOnly: true});
  // if(req.cookies.joinServer) {
  //   res.clearCookie("joinServer");
  //   addUser({client: req.client, accessToken: access_token, userId: user.id}).catch(err => console.error(err));
  // }

  if (req.cookies.backURL) {
    // eslint-disable-next-line no-shadow
    const url = decodeURIComponent(req.cookies.backURL);
    res.clearCookie("backURL");
    res.redirect(url);
  } else {
    res.redirect('/');
  }
});

route.get("/logout", async (req, res, next) => {
  res.clearCookie("accesskey");
  res.clearCookie("backURL");
  res.clearCookie("joinServer");

  res.redirect(`/?ref=logout`);
});

route.get('/join', async (req,res,next) => {
  res.redirect(process.env.GUILD_INVITE)
})

module.exports = route;
