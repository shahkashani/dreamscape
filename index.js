const express = require('express');
const app = express();
const { exec } = require('shelljs');

app.get('/', function(req, res) {
  exec(`python3 --version`, { silent: true }, (code, stdout, stderr) => {
    res.send(`Welcome to Dreamscape ${stdout}`);
  });
});

const server = app.listen(process.env.PORT, function() {
  const port = server.address().port;
  console.log(`Dreamscape running on port ${port}`);
});
