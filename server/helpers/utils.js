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
  console.log(process.env.GC_STORAGE_BUCKET_NAME);
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


module.exports = {
  validateEnvSync,
  doesFileExistInCloudStorage: doesFileExist,
  generateFilenameForCloudStorage,
  streamFileToCloudStorage,
};
