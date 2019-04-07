/* eslint-disable max-len */


const userToJson = userDBObj => ({
  id: userDBObj.id,
  googleId: userDBObj.google_id,
  facebookId: userDBObj.facebook_id,
  email: userDBObj.email,
  password: userDBObj.password,
  username: userDBObj.username,
  isEmployee: userDBObj.is_employee,
  isActive: userDBObj.is_active,
  createdAt: userDBObj.created_at,
  updatedAt: userDBObj.updated_at,
});

const userToDB = userJson => ({
  id: userJson.id,
  google_id: userJson.googleId,
  facebook_id: userJson.facebookId,
  email: userJson.email,
  password: userJson.password,
  username: userJson.username,
  is_employee: userJson.isEmployee,
  is_ctive: userJson.isActive,
  created_at: userJson.createdAt,
  updated_at: userJson.updatedAt,
});

const accountToJson = accountDBObj => ({
  id: accountDBObj.id,
  userId: accountDBObj.user_id,
  name: accountDBObj.name,
  surname: accountDBObj.surname,
  avatarUrl: accountDBObj.avatar_url,
  updatedAt: accountDBObj.updated_at,
});

const accountToDB = accountJson => ({
  id: accountJson.id,
  user_id: accountJson.userId,
  name: accountJson.name,
  surname: accountJson.surname,
  avatar_url: accountJson.avatarUrl,
  updated_at: accountJson.updatedAt,
});

const cityViewToJson = cityViewDBObj => ({
  id: cityViewDBObj.id,
  name: cityViewDBObj.name,
  description: cityViewDBObj.description,
  latitude: cityViewDBObj.latitude,
  longitude: cityViewDBObj.longitude,
  yearOfOrigin: cityViewDBObj.year_of_origin,
  photoUrl: cityViewDBObj.photo_url,
  streetNumber: cityViewDBObj.street_number,
  street: cityViewDBObj.street,
  city: cityViewDBObj.city,
  region: cityViewDBObj.region,
  district: cityViewDBObj.district,
  country: cityViewDBObj.country,
  userId: cityViewDBObj.user_id,
  updatedAt: cityViewDBObj.updated_at,
  createdAt: cityViewDBObj.created_at,
  status: cityViewDBObj.status,
});

const cityViewToDB = viewJson => ({
  id: viewJson.id,
  name: viewJson.name,
  description: viewJson.description,
  latitude: viewJson.latitude,
  longitude: viewJson.longitude,
  year_of_origin: viewJson.yearOfOrigin,
  photo_url: viewJson.photoUrl,
  street_number: viewJson.streetNumber,
  street: viewJson.street,
  city: viewJson.city,
  region: viewJson.region,
  district: viewJson.district,
  country: viewJson.country,
  user_id: viewJson.userId,
  updated_at: viewJson.updatedAt,
  created_at: viewJson.createdAt,
  status: viewJson.status,
});

const userArrayJsonToDB = userArrayJson => userArrayJson.map(userJson => userToDB(userJson));
const userArrayDBToJson = userArrayDB => userArrayDB.map(userDBObj => userToJson(userDBObj));
const accountArrayJsonToDB = accountArrayJson => accountArrayJson.map(accountJson => accountToDB(accountJson));
const accountArrayDBToJson = accountArrayDB => accountArrayDB.map(accountDBObj => accountToJson(accountDBObj));
const cityViewArrayJsonToDB = cityViewArrayJson => cityViewArrayJson.map(cityViewJson => cityViewToDB(cityViewJson));
const cityViewArrayDBToJson = cityViewArrayDB => cityViewArrayDB.map(cityViewDBObj => cityViewToJson(cityViewDBObj));


module.exports = {
  user: {
    one: {
      toJson: userToJson,
      toDB: userToDB,
    },
    many: {
      toJson: userArrayDBToJson,
      toDB: userArrayJsonToDB,
    },
  },
  account: {
    one: {
      toJson: accountToJson,
      toDB: accountToDB,
    },
    many: {
      toJson: accountArrayDBToJson,
      toDB: accountArrayJsonToDB,
    },
  },
  cityView: {
    one: {
      toJson: cityViewToJson,
      toDB: cityViewToDB,
    },
    many: {
      toJson: cityViewArrayDBToJson,
      toDB: cityViewArrayJsonToDB,
    },
  },
};
