const env = require('dotenv-flow').config({
  node_env: process.env.NODE_ENV,
  default_node_env: 'development',
});

module.exports.env = env;
