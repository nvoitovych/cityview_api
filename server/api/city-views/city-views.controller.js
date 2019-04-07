const {
  cityView, reverseGeo,
} = require('../../services/city-views.service');
const {
  doesFileExistInCloudStorage, streamFileToCloudStorage,
  generateFilenameForCloudStorage,
} = require('../../helpers/utils');

const getCityViewList = async (req, res) => {
  const resultCityViews = await cityView.findAll()
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  res.status(200).send(resultCityViews);
};

const getCityViewDetail = async (req, res) => {
  const { cityViewId } = req.app.locals;
  const resultCityViews = await cityView.findById(cityViewId)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  if (!resultCityViews) {
    res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'Resource not found' });
    return;
  }

  res.status(200).send(resultCityViews);
};

const deleteCityView = async (req, res) => {
  const { cityViewId, userId } = req.app.locals;

  const cityViewObj = await cityView.findById(cityViewId)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof cityViewObj === 'undefined') return;

  if (!cityViewObj) {
    res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'Resource not found' });
    return;
  }

  const isOwner = (cityViewObj.userId === userId);

  if (!isOwner) {
    res.status(403).send({ code: 403, status: 'FORBIDDEN', message: 'User don`t have permission to delete this resource' });
    return;
  }

  // delete only if user with userId is owner of cityView
  const deletedCityView = await cityView.delete(cityViewId)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof deletedCityView === 'undefined') return;

  if (!deletedCityView) {
    res.status(409).send({ code: 409, status: 'CONFLICT', message: 'Resource cannot be deleted at the moment. Try later' });
    return;
  }

  res.status(200).send({ success: true });
};

// TODO: add extracting address from latitude, longitude(with google places API)
const createCityView = async (req, res) => {
  const { cityViewObj, imageFile } = req.app.locals;

  const result = await reverseGeo({
    latitude: cityViewObj.latitude,
    longitude: cityViewObj.longitude,
  })
    .catch((error) => {
      console.error('reverseGeocode | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });

  if (typeof result === 'undefined') return;


  if (result === null) {
    console.error('result: ', result);
    res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    return;
  }
  const {
    streetNumber, street, city, region, district, country,
  } = result;


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
  const url = await streamFileToCloudStorage(imageFile, imageFileName).catch((error) => {
    console.error('imageStreamResult | error: ', error);
    switch (error.code) {
      default: {
        res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
        break;
      }
    }
  });
  if (typeof url === 'undefined') return;

  const mappedCityViewObj = {
    ...cityViewObj,
    imageURL: url,
    status: 'processing',
    streetNumber,
    street,
    city,
    region,
    district,
    country,
    createdAt: new Date(),
  };

  const resultCityViews = await cityView.createOne(mappedCityViewObj)
    .catch((error) => {
      console.error('resultCityViews | error: ', error);
      // Error depends on DB driver(MySQL, PostgreSQL, etc.)
      // ER_NO_REFERENCED_ROW_2 -- it`s error from MySQL
      // on trying to add city_view with user_id which doesn`t exist
      switch (error.code) {
        case 'ER_NO_REFERENCED_ROW_2': {
          res.status(401).send({ code: 401, status: 'UNAUTHORIZED', message: 'Token is invalid. There is no user with this token' });
          break;
        }
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof resultCityViews === 'undefined') return;

  res.status(200).send({ success: true });
};

const updateCityView = async (req, res) => {
  const {
    cityViewObj, imageFile, cityViewId, userId,
  } = req.app.locals;

  const result = await reverseGeo({
    latitude: cityViewObj.latitude,
    longitude: cityViewObj.longitude,
  })
    .catch((error) => {
      console.error('reverseGeocode | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });

  if (typeof result === 'undefined') return;

  if (result === null) {
    res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
    return;
  }
  const {
    streetNumber, street, city, region, district, country,
  } = result;
  let url;
  const unixtime = new Date().getTime();

  const foundCityView = await cityView.findById(cityViewId)
    .catch((error) => {
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof foundCityView === 'undefined') return;

  if (!foundCityView) {
    res.status(404).send({ code: 404, status: 'NOT_FOUND', message: 'Resource not found' });
    return;
  }

  const isOwner = (foundCityView.userId === userId);

  if (!isOwner) {
    res.status(403).send({ code: 403, status: 'FORBIDDEN', message: 'User don`t have permission to patch this resource' });
    return;
  }


  if (typeof imageFile !== 'undefined') {
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
    url = await streamFileToCloudStorage(imageFile, imageFileName).catch((error) => {
      console.error('imageStreamResult | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
    if (typeof url === 'undefined') return;
  }

  const mappedCityViewObj = {
    ...cityViewObj,
    imageURL: url,
    streetNumber,
    street,
    city,
    region,
    district,
    country,
    cityViewId,
  };

  const updatedCityView = await cityView.update(mappedCityViewObj)
    .catch((error) => {
      console.error('updatedCityView | error: ', error);
      switch (error.code) {
        default: {
          res.status(500).send({ code: 500, status: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
          break;
        }
      }
    });
  if (typeof updatedCityView === 'undefined') return;

  if (!updatedCityView) {
    res.status(409).send({ code: 409, status: 'CONFLICT', message: 'City view wasn`t updated' });
    return;
  }

  res.status(200).send({ success: true });
};


module.exports = {
  getCityViewList,
  createCityView,
  deleteCityView,
  getCityViewDetail,
  updateCityView,
};
