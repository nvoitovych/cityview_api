const express = require('express');

const router = express.Router();

router.get('/view', async (req, res) => {
  res.status(200).send([{
    id: '0', name: 'name 1', lat: 0.0, lot: 0.0, photoUrl: 'url to photo',
  }]);
});

router.get('/view/:id', async (req, res) => {
  res.status(200).send({
    id: '0', name: 'name 1', lat: 0.0, lot: 0.0, photoUrl: 'url to photo',
  });
});

router.post('/register', async (req, res) => {
  res.status(200).send({
    token: 'JWTokeen',
    account: {
      name: 'user name',
      surname: 'user surname',
      login: 'login/email',
      avatarUrl: 'url to avatar',
    },
  });
});

router.post('/auth', async (req, res) => {
  res.status(200).send({ token: 'JWT Ttt tokeeeeen' });
});

module.exports = router;
