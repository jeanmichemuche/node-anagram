const fs = require('fs');
const wordListPath = require('word-list');


module.exports = {
  env: 'dev',
  port: process.env.PORT || 3001,
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379/0',
  reset_db: false,
  wordFilePath: fs.readFileSync(wordListPath, 'utf8'),
};
