const express = require('express');
const app = express();
const { exec } = require('shelljs');
const GPT_FOLDER = './gpt';
const GPT_COMMAND = 'python3 generate_text.py';

const escapeShell = function(param) {
  return param.replace(/(["'])/g, '\\$1');
};

const getCmd = (text, length) => {
  const cleanText = escapeShell(text);
  return `cd ${GPT_FOLDER} && ${GPT_COMMAND} --text "${cleanText}" --length=${length}`;
};

app.get('/', function(req, res) {
  const { text, length = 200 } = req.query;
  if (!text) {
    res.json({});
    return;
  }
  console.log(`Generating text (${text}, ${length})...`);
  exec(getCmd(text, length), { silent: true }, (code, stdout) => {
    res.json({
      input: text,
      output: stdout
    });
  });
});

const server = app.listen(process.env.PORT || 8080, function() {
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
