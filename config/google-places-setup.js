const googleMaps = require('@google/maps');


const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise,
});


module.exports = {
  googleMapsClient,
};
