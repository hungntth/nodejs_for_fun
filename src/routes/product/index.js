'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuthen');


router.post('', asyncHandler(productController.createProduct))
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))

module.exports = router