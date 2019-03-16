const express = require('express');
const app = express();
const { exec } = require('shelljs');

var escapeShell = function(cmd) {
  return cmd.replace(/(["'])/g, '\\$1');
};

app.get('/', function(req, res) {
  const { text = 'Welcome to Flavortown', len = 200 } = req.query;
  const cleanText = escapeShell(text);
  const cmd = `cd gpt-2-Pytorch && python3 main.py --text "${cleanText}" --length=${len}`;
  exec(cmd, { silent: true }, (code, stdout, stderr) => {
    res.send(`Welcome to Dreamscape ${code} ${stdout} ${stderr}`);
  });
});

const server = app.listen(process.env.PORT, function() {
  const port = server.address().port;
  console.log(`Dreamscape running on port ${port}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});
