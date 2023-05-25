'use strict'

const express = require('express');
const router = express.Router();

// router.use(apiKey)
// router.use(permission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))

module.exports = router