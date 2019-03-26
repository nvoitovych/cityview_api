const app = require('./app');


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`NODE_ENV is ${process.env.NODE_ENV}\nServer is running on port ${port}...\n`);
});


module.exports = server;
