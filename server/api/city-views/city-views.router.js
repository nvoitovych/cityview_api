const express = require('express');
const { getCityViewList, getCityViewDetail } = require('./city-views.controller');
const { validateId } = require('./city-views.validator');


const router = express.Router();

router.get('/', getCityViewList);
router.get('/:id', validateId, getCityViewDetail);


module.exports = router;
