const express = require('express');
const app = express();
const { exec } = require('shelljs');

var escapeShell = function(cmd) {
  return cmd.replace(/(["'])/g, '\\$1');
};

app.get('/', function(req, res) {
  const { text = 'Welcome to Flavortown', len = 200 } = req.query;
  const cleanText = escapeShell(text);
  const cmd = `python3 gpt-2-Pytorch/main.py --text "${cleanText}" --length=${len}`;
  exec(cmd, { silent: true }, (code, stdout, stderr) => {
    res.send(`Welcome to Dreamscape ${code} ${stdout} ${stderr}`);
  });
});

const server = app.listen(process.env.PORT, function() {
  const port = server.address().port;
  console.log(`Dreamscape running on port ${port}`);
});
