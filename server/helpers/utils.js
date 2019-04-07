const stream = require('stream');

const { storage } = require('../../config/gcstorage-setup');


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

const generateFilenameForCloudStorage = async (userId, unixtime) => {
  const filename = `${unixtime}-${userId}`;
  return filename;
};

const doesFileExist = async (filename) => {
  // check if a file exists in bucket
  const bucket = storage.bucket(process.env.GC_STORAGE_BUCKET_NAME);
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
  const myBucket = storage.bucket(process.env.GC_STORAGE_BUCKET_NAME);

  // Define file & file name.
  const file = myBucket.file(imageFileName);

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

// Converts numeric degrees to radians
const toRadianSync = degree => degree * Math.PI / 180;

// start and end are objects with latitude and longitude
// decimals (default 2) is number of decimals in the output
// return is distance in kilometers.
const getDistanceSync = (start, end, precision) => {
  const earthRadius = 6371; // km

  const decimals = precision || 2;
  const startLatDegree = parseFloat(start.latitude);
  const endLatDegree = parseFloat(end.latitude);
  const startLonDegree = parseFloat(start.longitude);
  const endLonDegree = parseFloat(end.longitude);
  const dLat = toRadianSync(endLatDegree - startLatDegree);
  const dLon = toRadianSync(endLonDegree - startLonDegree);
  const startLatRadian = toRadianSync(startLatDegree);
  const endLatRadian = toRadianSync(endLatDegree);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(startLatRadian) * Math.cos(endLatRadian);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = earthRadius * c;
  return Math.round(d * (10 ** decimals) / (10 ** decimals));
};


module.exports = {
  getDistanceSync,
  validateEnvSync,
  doesFileExistInCloudStorage: doesFileExist,
  generateFilenameForCloudStorage,
  streamFileToCloudStorage,
};
