require('../config/config'); // run dotenv-flow to init process.env
const app = require('./app');


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`NODE_ENV is ${process.env.NODE_ENV}\nServer is running on port ${port}...`);
});


module.exports = server;
