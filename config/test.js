module.exports = {
  env: 'test',
  port: process.env.PORT || 4001,
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379/1',
  reset_db: true,
  wordFilePath: 'zebra,braze,test,sett,stet,tets'.split(',').join('\n'),
};
