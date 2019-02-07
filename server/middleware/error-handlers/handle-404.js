const handle404Error = async (req, res) => {
  res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'Not Found' });
};


module.exports = {
  handle404Error,
};
