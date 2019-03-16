const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Welcome to Dreamscape');
});

const server = app.listen(process.env.PORT, function() {
  const port = server.address().port;
  console.log(`Dreamscape running on port ${port}`);
});
