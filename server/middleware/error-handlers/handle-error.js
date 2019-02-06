const handleError = async (req, res) => {
  res
    .status(500)
    .send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
};


module.exports = {
  handleError,
};
