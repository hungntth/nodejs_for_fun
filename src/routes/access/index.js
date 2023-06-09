'user strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuthen');

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

module.exports = router