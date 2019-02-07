const { account } = require('../../services/users.service');


const getAccountDetail = async (req, res) => {
  const { userId } = req.app.locals;

  const resultUser = await account.findOneByUserId(userId).catch((error) => {
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'User doesn\'t exist' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof resultUser === 'undefined') return;

  res.status(200).send({ resultUser });
};


module.exports = {
  getAccountDetail,
};
