'use strict';
require('dotenv').config();
const superagent = require('superagent');

const remoteAPI = 'https://www.googleapis.com/drive/v2/files';


module.exports = async (req, res, next) => {
  try {
    
    console.log('hello from the middleware');
    const token = req.access_token;
    
    const remoteUser = await getRemoteUserInfo(token);
    
    req.user = remoteUser;
    next();
  } catch (err) {
    next(err.message);
  }
};

async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `Bearer ${token}`)
  const user = userResponse.body;
  return user;
}

