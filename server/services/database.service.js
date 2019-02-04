const config = require('../../knexfile'); // init knex to work with db


module.exports = require('knex')(config);
