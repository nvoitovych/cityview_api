const {
  doesFileExistInCloudStorage, streamFileToCloudStorage,
  generateFilenameForCloudStorage,
} = require('../../helpers/utils');
const { account, user } = require('../../services/users.service');


const getPublicAccountDetail = async (req, res) => {
  const { userIdInURL } = req.app.locals;

  const publicAccountDetail = await account.findOneByUserId(userIdInURL).catch((error) => {
    switch (error.code) {
      case 'ACCOUNT_NOT_FOUND': {
        res.status(404).send({ code: 404, status: 'USER_NOT_FOUND', message: 'User not found' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof publicAccountDetail === 'undefined') return;

  res.status(200).send(publicAccountDetail);
};

const getPublicAccountList = async (req, res) => {
  const publicAccountList = await account.find().catch((error) => {
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof publicAccountList === 'undefined') return;

  res.status(200).send(publicAccountList);
};

const getPrivateAccountDetail = async (req, res) => {
  const { userId } = req.app.locals;

  const privateUserDetail = await user.findById(userId).catch((error) => {
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'User not found' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof privateUserDetail === 'undefined') return;

  const privateAccountDetail = await account.findOneByUserId(userId).catch((error) => {
    switch (error.code) {
      case 'USER_NOT_FOUND': {
        res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'User not found' });
        break;
      }
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
      }
    }
  });
  if (typeof privateAccountDetail === 'undefined') return;

  res.status(200).send({ ...privateUserDetail, ...privateAccountDetail });
};

const deleteUserCredentialsAndAccount = async (req, res) => {
  const { userId } = req.app.locals;

  const deletedUserAndAccount = await user.delete(userId)
    .catch((error) => {
      console.error('deleteUserCredentialsAndAccount | deletedUserAndAccount | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof deletedUserAndAccount === 'undefined') return;

  if (!deletedUserAndAccount) {
    res.status(409).send({ code: 409, status: 'CONFLICT', message: 'Resource cannot be deleted at the moment. Try later' });
    return;
  }

  res.status(200).send({ success: true });
};

const updateUserCredentialsAndAccount = async (req, res) => {
  const { userId, avatarFile } = req.app.locals;
  const {
    // email,
    password,
    username,
    isEmployee,
    isActive,
    googleId,
    facebookId,
    name,
    surname,
  } = req.app.locals.userProfile;

  let avatarURL;
  if (avatarFile) {
    const unixtime = new Date().getTime();
    const imageFileName = await generateFilenameForCloudStorage(req.app.locals.userId, unixtime)
      .catch((error) => {
        console.error('imageStreamResult | error: ', error);
        switch (error.code) {
          default: {
            res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
            break;
          }
        }
      });

    const doesImageExistInCloudStorageResult = await doesFileExistInCloudStorage(imageFileName)
      .catch((error) => {
        console.error('doesImageExistInGCS | error: ', error);
        switch (error.code) {
          default: {
            res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
            break;
          }
        }
      });
    if (typeof doesImageExistInCloudStorageResult === 'undefined') return;
    if (doesImageExistInCloudStorageResult) {
      res.status(400).send({ code: 400, status: 'BAD_REQUEST', message: 'Image this same name is already exists' });
      return;
    }
    // return url
    avatarURL = await streamFileToCloudStorage(avatarFile, imageFileName).catch((error) => {
      console.error('imageStreamResult | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
    if (typeof avatarURL === 'undefined') return;
  }

  const mappedProfileObj = {
    userId,
    // email,
    password,
    username,
    isEmployee,
    isActive,
    googleId,
    facebookId,
    name,
    surname,
    avatarURL,
  };

  const updatedProfile = await user.update(mappedProfileObj)
    .catch((error) => {
      console.error('updatedProfile | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof updatedProfile === 'undefined') return;

  if (!updatedProfile) {
    res.status(409).send({ code: 409, status: 'CONFLICT', message: 'User profile wasn`t updated' });
    return;
  }

  res.status(200).send({ success: true });
};


module.exports = {
  getPublicAccountList,
  getPublicAccountDetail,
  getPrivateAccountDetail,
  updateUserProfile: updateUserCredentialsAndAccount,
  deleteAccount: deleteUserCredentialsAndAccount,
};
