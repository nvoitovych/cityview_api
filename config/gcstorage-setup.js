const { Storage } = require('@google-cloud/storage');
const path = require('path');


const absoluteGCStorageKeyFilePath = path.resolve('./config/city-view-5f74b78e4679.json');
const storage = new Storage({
  projectId: process.env.GC_STORAGE_PROJECT_ID,
  keyFilename: absoluteGCStorageKeyFilePath, // path and filename
});


module.exports = {
  storage,
};
