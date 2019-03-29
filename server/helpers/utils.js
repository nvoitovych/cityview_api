// todo: add validation statements of environment
const validateEnvSync = ({ PORT }) => {
  if (PORT === null
    || PORT === ''
    || typeof PORT === 'undefined'
  ) {
    throw Error('Set up all Env variables');
  }
  return null;
};

const convertDateFormat = async (date) => {
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const mm = m < 10 ? `0${m}` : m;
  const dd = d < 10 ? `0${d}` : d;
  return `${yyyy}${mm}${dd}`;
};


module.exports = {
  validateEnvSync,
  convertDateFormat,
};
