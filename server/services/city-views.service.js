const stream = require('stream');

const knex = require('./database.service');
const mapper = require('../helpers/entity-mapper');
const { storage } = require('../../config/gcstorage-setup');


const BUCKET_NAME = process.env.GC_STORAGE_BUCKET_NAME;

const cityViewFindById = async (id) => {
  const resultCityViewArray = await knex('city_view')
    .where({ id })
    .catch((error) => {
      throw error;
    });
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.one.toJson(resultCityViewArray[0]);
  }
  return null;
};

// delete cityView only if cityView is created by user with userId
const cityViewDeleteById = async (cityViewId) => {
  const deletedCityView = await knex('city_view')
    .where({ id: cityViewId })
    .del()
    .returning('*')
    .catch((error) => {
      throw error;
    });

  return deletedCityView;
};

const cityViewFindAll = async () => {
  const resultCityViewArray = await knex('city_view')
    .select('*')
    .catch((error) => {
      throw error;
    });
  if (Array.isArray(resultCityViewArray) && resultCityViewArray.length) {
    return mapper.cityView.many.toJson(resultCityViewArray);
  }
  return [];
};

const createOneCityView = async ({
  userId, name, description, latitude, longitude, yearOfOrigin,
  status, createdAt, street, city, region, country, imageURL,
}) => knex('city_view')
  .insert({
    user_id: userId,
    name,
    description,
    latitude,
    longitude,
    year_of_origin: yearOfOrigin,
    photo_url: imageURL,
    status,
    created_at: createdAt,
    street,
    city,
    region,
    country,
  })
  .returning('id')
  .catch((error) => {
    throw error;
  });

const generateFilenameForCloudStorage = async (userId, unixtime) => {
  const filename = `${unixtime}-${userId}`;
  return filename;
};

const doesImageExist = async (filename) => {
  // check if a file exists in bucket
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(filename);
  const exists = await file.exists().catch((error) => {
    throw error;
  });
  // returns [true | false]
  if (exists[0]) {
    return true;
  }
  return false;
};

// get public url for file
// eslint-disable-next-line arrow-body-style
const getPublicThumbnailUrlForItemSync = (filename) => {
  return `https://storage.googleapis.com/${process.env.GC_STORAGE_BUCKET_NAME}/${filename}`;
};

const streamFileToCloudStorage = async (imageFile, imageFileName) => {
  const bufferStream = new stream.PassThrough();

  bufferStream.end(Buffer.from(imageFile.data, 'base64'));
  // Define bucket.
  const myBucket = storage.bucket(BUCKET_NAME);

  // Define file & file name.
  const file = myBucket.file(imageFileName);
  // console.log('file: ', file);

  // Pipe the 'bufferStream' into a 'file.createWriteStream' method.
  bufferStream.pipe(file.createWriteStream({
    metadata: {
      contentType: imageFile.mimetype,
      metadata: {
        custom: 'metadata',
      },
    },
    public: true,
    validation: 'md5',
  }))
    .on('error', (error) => {
      throw error;
    })
    .on('finish', () => ({ success: true }));

  const url = getPublicThumbnailUrlForItemSync(imageFileName);
  return url;
};

const cityViewUpdateById = async ({
  cityViewId, name, description, latitude, longitude, yearOfOrigin,
  status, street, city, region, country, imageURL,
}) => {
  const updatedCityView = await knex('city_view')
    .where({ id: cityViewId })
    .update({
      name,
      description,
      latitude,
      longitude,
      year_of_origin: yearOfOrigin,
      status,
      street,
      city,
      region,
      country,
      photo_url: imageURL,
    })
    .returning('id')
    .catch((error) => {
      throw error;
    });
  if (!updatedCityView) return null;

  return { success: true };
};


module.exports = {
  cityView: {
    update: cityViewUpdateById,
    delete: cityViewDeleteById,
    findAll: cityViewFindAll,
    findById: cityViewFindById,
    createOne: createOneCityView,
  },
  doesImageExistInCloudStorage: doesImageExist,
  getPublicThumbnailUrlForItemSync,
  generateFilenameForCloudStorage,
  streamFileToCloudStorage,
};
