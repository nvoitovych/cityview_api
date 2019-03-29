/* eslint-disable import/order */
const { validateEnvSync } = require('../server/helpers/utils');


const { NODE_ENV } = process.env;
let envConfigPath;

/*
NOTE: When you run `node server.js`, the current working directory is `/home/myapp/`
so your file is found. When your upstart script runs or you run `node /home/myapp/server.js`,
the current working directory is whatever `pwd` returns
console.log('Current Working Directory: ', process.cwd());
*/
switch (NODE_ENV) {
  case 'development': {
    envConfigPath = './config/development.env';
    break;
  }
  case 'production': {
    envConfigPath = './config/production.env';
    break;
  }
  case 'migrationsProd': {
    envConfigPath = './config/migrations.prod.env';
    break;
  }
  case 'migrationsDev': {
    envConfigPath = './config/migrations.dev.env';
    break;
  }
  default: {
    envConfigPath = './config/.env';
  }
}
const { error, parsed } = require('dotenv').config({ debug: true, path: envConfigPath });

if (typeof error !== 'undefined') {
  // eslint-disable-next-line no-console
  console.error('Error on server started with dotenv:\n', error);
  throw Error;
}

validateEnvSync(parsed);
