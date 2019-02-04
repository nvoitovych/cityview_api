const express = require('express');
const { getCityViewList, getCityViewDetail } = require('./city-views.controller');


// TODO: validation of params(id)
const router = express.Router();

router.get('/', getCityViewList);
router.get('/:id', getCityViewDetail);


module.exports = router;
