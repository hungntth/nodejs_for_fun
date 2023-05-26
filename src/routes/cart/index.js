'use strict'

const express = require('express');
const carttController = require('../../controllers/cart.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuthen');

router.post('', asyncHandler(carttController.addToCart))
router.delete('', asyncHandler(carttController.delete))
router.post('/update', asyncHandler(carttController.update))
router.get('', asyncHandler(carttController.listToCart))


module.exports = router