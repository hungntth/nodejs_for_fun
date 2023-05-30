'use strict'

const express = require('express');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuthen');


router.post('', asyncHandler(inventoryController.addStockToInventory))

module.exports = router