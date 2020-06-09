require('dotenv').config();
const express = require('express');
const oauth = require('./OAuth.js');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static('./public'));

// oauth route
app.get('/oauth', oauth, (req, res) => {
  console.log('hi');
  res.json(req.user);
});
app.listen(PORT, () => console.log(`server is up ${PORT}`));
