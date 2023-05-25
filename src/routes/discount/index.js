'use strict'

const express = require('express');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuthen');


router.post('/mount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

module.exports = router