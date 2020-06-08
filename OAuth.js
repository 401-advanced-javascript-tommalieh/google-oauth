'use strict';
require('dotenv').config();
const superagent = require('superagent');
// const users = require('./users.js');
//this came from the docs will be used to exchange the code for a token from GH
// const tokenServerUrl = 'https://github.com/login/oauth/access_token';
// this came from the docs and will be used to get the user by sending the token that we got from GH
const remoteAPI = 'https://www.googleapis.com/drive/v2/files';
// this is the public key that came from GH
// const CLIENT_ID = process.env.CLIENT_ID;
// the private key from GH DONT SHARE IT
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// the url that we will be redirected to from GH after we are authorized
//http://localhost:3000/oauth
// const API_SERVER = process.env.API_SERVER;

module.exports = async (req, res, next) => {
  //2 & 3
  try {
    //the code is coming back from the popup
    console.log('hi');
    const token = req.access_token;
    
    const remoteUser = await getRemoteUserInfo(token);
    // const [user, token] = await getUser(remoteUser);
    // console.log('LOCAL USER', user);
    // since this is a middleware we can put user and token on the req obj
    req.user = remoteUser;
    next();
  } catch (err) {
    next(err.message);
  }
};

// get the remote user from GH by using the Token that came from GH
// example token = 1151e79c9a6799d132f8240ebf2427d3bf6db5f9
async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('user-agent', 'express-app');
    .set('Authorization', `Bearer ${token}`)
  const user = userResponse.body;
  return user;
}
// save the user to db and return that user + our token
// async function getUser(remoteUser) {
//   const userRecord = {
//     username: remoteUser.login,
//     password: 'anysting', // Math.random(1000), // this can be anything just because its required in the db
//   };
//   const user = await users.save(userRecord);
//   const token = users.generateToken(user);
//   return [user, token];
// }
