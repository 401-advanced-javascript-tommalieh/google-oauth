'use strict';
require('dotenv').config();
const superagent = require('superagent');
const users = require('./users.js');
//this came from the docs will be used to exchange the code for a token from GH
const tokenServerUrl = 'https://github.com/login/oauth/access_token';
// this came from the docs and will be used to get the user by sending the token that we got from GH
const remoteAPI = 'https://api.github.com/user';
// this is the public key that came from GH
const CLIENT_ID = process.env.CLIENT_ID;
// the private key from GH DONT SHARE IT
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// the url that we will be redirected to from GH after we are authorized
//http://localhost:3000/oauth
const API_SERVER = process.env.API_SERVER;

module.exports = async (req, res, next) => {
  //2 & 3
  try {
    //the code is coming back from the popup
    const code = req.query.code;
    console.log('__THE CODE__', code);
    // this will call the function and will get back the Token from GH
    const remoteToken = await exchangeCodeForToken(code);
    console.log('The TOKEN', remoteToken);
    // 4
    // get the user obj from GH by sending the token from GH
    const remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('GITHUB USER', remoteUser);
    // sending the GH user and save it to db get back local user + token
    const [user, token] = await getUser(remoteUser);
    console.log('LOCAL USER', user);
    // since this is a middleware we can put user and token on the req obj
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err.message);
  }
};
// after the popup send the code to github for Token
//example code =  aa1c33644c4dbf7abc72
async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code', //remove
  });
  const access_token = tokenResponse.body.access_token;
  return access_token;
}
// get the remote user from GH by using the Token that came from GH
// example token = 1151e79c9a6799d132f8240ebf2427d3bf6db5f9
async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');
  const user = userResponse.body;
  return user;
}
// save the user to db and return that user + our token
async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.login,
    password: 'anysting', // Math.random(1000), // this can be anything just because its required in the db
  };
  const user = await users.save(userRecord);
  const token = users.generateToken(user);
  return [user, token];
}
