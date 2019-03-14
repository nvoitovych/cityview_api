const validateEnvSync = ({ PORT }) => {
  if (PORT === null
    || PORT === ''
    || typeof PORT === 'undefined'
  ) {
    throw Error('Set up all Env variables');
  }
  return null;
};


module.exports = {
  validateEnvSync,
};
