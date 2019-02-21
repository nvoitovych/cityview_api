/* eslint-disable no-param-reassign */
const BlueBird = require('bluebird');
const jwt = BlueBird.promisifyAll(require('jsonwebtoken'));
const nodemailer = require('nodemailer');
const knex = require('./database.service');
const smtpTransport = require('nodemailer-smtp-transport');
// const crypto = require('crypto');

const {
  EMAIL_TOKEN_SECRET, EMAIL_PASSWORD, PASSWORD_TO_AES_KEY, AES_SALT, AES_ALGORITHM,
  GMAIL_ADDRESS, GOOGLE_GMAIL_REFRESH_TOKEN, GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID, GOOGLE_GMAIL_ACCESS_TOKEN,
} = process.env;

// confirmationToken with AES encryption
// const generateEmailConfirmationToken = async (userId) => {
//   const token = await jwt.signAsync({
//     id: userId,
//     exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // 2 hour
//   }, EMAIL_TOKEN_SECRET)
//     .catch((error) => {
//       console.log(`Error: ${error}`);
//     });
//   if (typeof token === 'undefined') return undefined;
//
//   const key = await crypto.scrypt(PASSWORD_TO_AES_KEY, AES_SALT, 24).catch((error) => {
//     console.log(error);
//   });
//   const iv = await crypto.randomBytes(16).catch((error) => {
//     console.log(error);
//   });
//   if (typeof key === 'undefined' || typeof iv === 'undefined') return undefined;
//
//   const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
//   let encryptedToken = cipher.update(token, 'utf8', 'hex');
//   encryptedToken += cipher.final('hex');
//
//   return { encryptedToken, iv };
// };
//
// const decodeEmailConfirmationToken = async (confirmationToken, iv) => {
//   if (!confirmationToken) {
//     return undefined;
//   }
//
//   const key = await crypto.scrypt(PASSWORD_TO_AES_KEY, AES_SALT, 24).catch((error) => {
//     console.log(error);
//   });
//   if (typeof key === 'undefined' || typeof iv === 'undefined') return undefined;
//
//   const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);
//   let decryptedToken = decipher.update(confirmationToken, 'hex', 'utf8');
//   decryptedToken += decipher.final('utf8');
//
//   const decode = await jwt
//     .verifyAsync(decryptedToken, EMAIL_TOKEN_SECRET)
//     .catch((error) => {
//       switch (error.name) {
//         case 'TokenExpiredError': {
//           error.code = 'TokenExpiredError';
//           throw error;
//         }
//         case 'JsonWebTokenError': {
//           error.code = 'JsonWebTokenError';
//           throw error;
//         }
//         default: {
//           throw error;
//         }
//       }
//     });
//   if (typeof decode === 'undefined') return undefined;
//
//   if (typeof decode.id === 'undefined' || !parseInt(decode.id, 10)) {
//     const error = new Error('Token is malformed');
//     error.code = 400;
//     error.status = 'BAD_REQUEST';
//     throw error;
//   }
//
//   return decode;
// };

// confirmationToken WITHOUT AES encryption
const generateEmailConfirmationToken = async (userId) => {
  const token = await jwt.signAsync({
    id: userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // 2 hours
  }, EMAIL_TOKEN_SECRET)
    .catch((error) => {
      throw error;
    });

  return token;
};

const decodeEmailConfirmationToken = async (confirmationToken) => {
  const decode = await jwt
    .verifyAsync(confirmationToken, EMAIL_TOKEN_SECRET)
    .catch((error) => {
      switch (error.name) {
        case 'TokenExpiredError': {
          error.code = 'TOKEN_EXPIRED_ERROR';
          throw error;
        }
        case 'JsonWebTokenError': {
          error.code = 'JSON_WEB_TOKEN_ERROR';
          throw error;
        }
        default: {
          throw error;
        }
      }
    });

  if (typeof decode.id === 'undefined' || !parseInt(decode.id, 10)) {
    const error = new Error('Token is malformed');
    error.code = 'TOKEN_IS_MALFORMED';
    throw error;
  }
  return decode;
};

const sendEmailConfirmationToken = async (generatedToken, receiverEmail) => {
  const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: GMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
      // type: 'oauth2',
      // user: GMAIL_ADDRESS,
      // clientId: GOOGLE_CLIENT_ID,
      // clientSecret: GOOGLE_CLIENT_SECRET,
      // refreshToken: GOOGLE_GMAIL_REFRESH_TOKEN,
      // accessToken: GOOGLE_GMAIL_ACCESS_TOKEN,
    },
  }));

  const mailOptions = {
    from: GMAIL_ADDRESS, // sender address
    to: 'chumba.vumbaa@gmail.com', // list of receivers
    subject: 'Email Confirmation', // Subject line
    html: `<p>Please, Confirm your email:</p><a href="http://localhost:8080/public/auth/confirm-email/${generatedToken}">Confirm</a>`,
  };

  const sendingDetails = await transporter.sendMail(mailOptions).catch((error) => {
    console.log(`Error during email sending: ${error}`);
    switch (error.code) {
      default: {
        throw error;
      }
    }
  });
  if (typeof sendingDetails === 'undefined') return undefined;
  return sendingDetails;
};

const createUserAndAccount = async ({
  email, password, username, isEmployee, isActive,
}) => {
  // const trx = await Promise.promisify(knex.transaction);
  console.log('0');
  const result = await knex.transaction(async (trx) => {
    const userId = await trx('user_credentials')
      .insert({
        email,
        password,
        username,
        is_active: isActive,
        is_employee: isEmployee,
        created_at: new Date(),
      })
      .returning('id') // returns an array of ids
      .catch(async (error) => {
        // console.log('Error 1: ', error);
        console.log('1. Error ');
        await trx.rollback(error);
        console.log('2. Continue after rollback');
        throw error;
      });
    console.log('3. Continue after user credentials creation');
    console.log('userId: ', userId);
    const accountId = await trx('account')
      .insert({ user_id: userId[0] })
      .into('account')
      .returning('user_id') // returns an array of ids
      .catch(async (error) => {
        // console.log('Error 2: ', error);
        console.log('4. Error ');
        await trx.rollback(error);
        console.log('5. Continue after 4. Error rollback');
        throw error;
      });
    console.log('6');
    console.log('accountId: ', accountId);
    await trx.commit(userId[0]);
    console.log('7');
  }).catch((error) => {
    console.log('Error 8: ');
    throw error;
  });
  console.log('result: ', result);
  return result;
};


module.exports = {
  generateEmailConfirmationToken,
  decodeEmailConfirmationToken,
  sendEmailConfirmationToken,
  createUserAndAccount,
};
