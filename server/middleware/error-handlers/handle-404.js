module.exports.handle404Error = async (req, res) => {
  res.status(404).send({ code: 400, status: 'NOT_FOUND', message: 'Not Found' });
};
